import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, delay, switchMap, map, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ListItems, DeleteItem } from 'app/shared/interfaces';
import { ColumnsModel } from 'app/shared/components/grid-columns-picker/columns-model';

export class BaseList<T, S extends ListItems<T> & DeleteItem<T>> {

    searchTerms = new Subject<string>(); 
    
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    entityList: T[] = [];
    columnsToDisplay: string[] = [];
    columnsList: ColumnsModel[] = [];
    isLoadingResults = true;
    resultsLength = 0;
    pageSize = 100;
    
    constructor(public router: Router,
                public service: S,
                public dialog: MatDialog,
                public snacBar: MatSnackBar,
                public translateService: TranslateService,
                public cookieStr: string,
                public displayedColumns: string[],
                public createdUrl: string) {
        
    }

     setColumns(notCustomiesColumns: string[]): void {
        this.columnsToDisplay = Object.assign([], this.displayedColumns);
        this.displayedColumns.forEach(element => {
            if (!notCustomiesColumns.includes(element)) {
              this.columnsList.push({ name: element, translatedName: element, checked: true });
            }
        });
    }

    getItems( index: number = 0): void {
        this.paginator.pageIndex = index;        
       
        merge(this.sort.sortChange, this.paginator.page, this.searchTerms)
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                startWith({}),
                delay(0),
                switchMap((term: string) => {
                    if (typeof(term) !== 'string') {
                        term = '';
                    }
                    this.paginator.pageSize = this.pageSize;
                    this.paginator.hidePageSize = true;
                    this.isLoadingResults = true;
                    return this.service.loadListResults(
                    this.paginator.pageIndex + 1,
                    this.sort.active,
                    this.sort.direction,
                    term);
                }),
                map(data => {
                    this.isLoadingResults = false;
                    this.resultsLength = data.totalCount;
                    return data.items;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    return observableOf([]);
                })
            ).subscribe((data) => {
                this.entityList = data;          
            });

        this.isLoadingResults = true;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);        
    }

    create(): void {
        this.router.navigate([this.createdUrl]);
    }

    applyFilter(filterValue: string): void {
        this.searchTerms.next(filterValue);
    }

    changeColumn(event: string): void {
        const index: number = this.columnsToDisplay.indexOf(event);
        if (index !== -1){
            this.columnsToDisplay.splice(index, 1);
        } else {
            const nIndex: number = this.displayedColumns.indexOf(event);
            this.columnsToDisplay.splice(nIndex, 0, event);
        }
    }

    delete(entity: T, messege: string, 
           entityKey: string,
           erpCompanyId?: number, logisticSiteCode?: string): void {
        this.isLoadingResults = true;
            
        this.service.deleteItem(entity, erpCompanyId).subscribe(() => {
            this.getItems();
            this.snacBar.open(`${this.translateService.instant(messege, { value: entity[entityKey] })}`, null, {
                duration: 2000,
                verticalPosition: 'top'
            });
        });
    }
}
