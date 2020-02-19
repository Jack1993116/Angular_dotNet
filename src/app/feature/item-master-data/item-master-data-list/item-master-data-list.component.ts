import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseList } from 'app/feature/base-components/classes/base-list';
import { ItemMasterDataService } from '../item-master-data.service';
import { ItemMasterData } from '../ItemMasterData';
import { DialogDeleteConfirmtionComponent } from 'app/shared/components/dialog-delete-confirmtion/dialog-delete-confirmtion.component';

@Component({
    selector: 'app-item-master-data-list',
    templateUrl: './item-master-data-list.component.html',
    styleUrls: ['./item-master-data-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ItemMasterDataListComponent 
    extends BaseList<ItemMasterData, ItemMasterDataService>
    implements OnInit, AfterViewInit{    
            
    pageCount: number[] = [];

    constructor(public router: Router,
                public itemService: ItemMasterDataService,
                public dialog: MatDialog,
                public snacBar: MatSnackBar,
                public translateService: TranslateService) {
        super(router, itemService, dialog, snacBar, translateService,
            'FUSE2.ItemMasterData', ['itemId', 'itemCode', 'itemName',
            'itemGroupCode', 'itemType', 'baseUnitCode', 'delete'],
            'item-master-data/create');
    }
    
    ngOnInit(): void {
        this.setColumns(['itemId', 'delete']);          
   }

    ngAfterViewInit(): void {
        this.getItems();
        setTimeout(() => {           
            for ( let i = 0; i < this.paginator.getNumberOfPages(); i++) {
                this.pageCount[i] = i + 1; 
            } 
        }, 2000);
    }

    updatePage(event: number): void {
        this.getItems(event);
    }

    goFirstPage(): void {
        this.paginator.firstPage();
    }

    goPrevPage(): void {
        this.getItems(this.paginator.pageIndex - 1);      
    }

    goNextPage(): void {
        this.getItems(this.paginator.pageIndex + 1);             
    }

    goLastPage(): void {
        this.paginator.lastPage();
    }

    delete(item: ItemMasterData): void {
        this.openDialog().subscribe(result => {
            if (result === true) {
                super.delete(item, 'IMD_DELETED', 'itemName');
            }
        });   
    }

    openDialog(): Observable<boolean> {
        const dialogRef = this.dialog.open(DialogDeleteConfirmtionComponent, {
            minWidth: '250px'
        });

        return dialogRef.afterClosed();
    }

    // changeColumn(event: string): void {
    //     const index: number = this.columnsToDisplay.indexOf(event);
    //     if (index !== -1){
    //         this.columnsToDisplay.splice(index, 1);
    //     } else {
    //         const nIndex: number = this.displayedColumns.indexOf(event);
    //         this.columnsToDisplay.splice(nIndex, 0, event);
    //     }
    // }
}
