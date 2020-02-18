import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseList } from 'app/feature/base-components/classes/base-list';
import { LocationsService } from '../locations.service';
import { Location, LogisticLocation } from '../Location';
import { SelectionModel } from '@angular/cdk/collections';
import { Printer } from 'app/core/services/printers/Printer';
import { Label } from 'app/core/services/labels/Label';
import { LabelsService } from 'app/core/services/labels/labels.service';
import { PrintersService } from 'app/core/services/printers/printers.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocationsListComponent 
    extends BaseList<Location, LocationsService>
    implements OnInit, AfterViewInit {

  selection = new SelectionModel<any>(true, []);
  printers: Printer[] = [];
  selectedPrinter: number;
  labels: Label[] = [];
  selectedlabel: number;
  pageCount: number[] = [];

  constructor(public router: Router,
              public locationsService: LocationsService,
              public dialog: MatDialog,
              public snacBar: MatSnackBar,
              public translateService: TranslateService,
              private labelService: LabelsService,
              private printersService: PrintersService) { 
    super(router, locationsService, dialog, snacBar, translateService,
      'FUSE2.Locations', ['select', 'locCode', 'displayLocCode', 'locName'], '');

    this.labelService.loadListResults()
        .subscribe(data => {
          this.labels = data.items;
      });

    this.printersService.loadListResults()
      .subscribe(data => {
        this.printers = data.items;
      });
  }

  ngOnInit(): void {
    this.setColumns(['select']);
  }

    ngAfterViewInit(): void {
        this.getItems();
        setTimeout(() => {           
            for ( let i = 0; i < this.paginator.getNumberOfPages(); i++) {
                this.pageCount[i] = i + 1; 
            } 
        }, 2000);
    }

    updatePage(event: number) {
        this.getItems(event);
    }

    goFirstPage() {
        this.paginator.firstPage();
    }

    goPrevPage() {
        this.getItems(this.paginator.pageIndex - 1);      
    }

    goNextPage() {
        this.getItems(this.paginator.pageIndex + 1);             
    }

    goLastPage() {
        this.paginator.lastPage();
    }

  isAllSelected(): boolean {
    if (this.entityList) {
      const numSelected = this.selection.selected.length;
      const numRows = this.entityList.length;
      return numSelected === numRows;
    }
    return false;
  }

  masterToggle(): void {
    this.isAllSelected() ?
        this.selection.clear() :
        this.entityList.forEach(row => this.selection.select(row));
  }

  printLables(): void {
    const logisticLocations: LogisticLocation = {};
    this.selection.selected.forEach(selctedLoc => {
      if (logisticLocations[selctedLoc['logisticSiteCode']]) {
        logisticLocations[selctedLoc['logisticSiteCode']]
          .push(selctedLoc['locID']);
      }
      else {
        logisticLocations[selctedLoc['logisticSiteCode']] 
          = [selctedLoc['locID']];
      }
    });
    this.locationsService.printLocations(
      logisticLocations, this.selectedlabel,
      this.selectedPrinter).subscribe(data => {
        if (data) {
          this.getItems();
          this.snacBar.open(`${this.translateService.instant(
            'PRINTED')}`, null, {
              duration: 2000,
              verticalPosition: 'top'
            });
        } else {
          this.snacBar.open(`There was an issue, please check the log`, null, {
            duration: 2000,
            verticalPosition: 'top'
          });
        }
      });
  }

}
