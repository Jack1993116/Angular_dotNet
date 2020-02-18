import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseList } from 'app/feature/base-components/classes/base-list';
import { ExpectedGoodsShipment } from '../ExpectedGoodsShipment';
import { ExpectedGoodsShipmentService } from '../expected-goods-shipment-service';
import { DialogDeleteConfirmtionComponent } from 'app/shared/components/dialog-delete-confirmtion/dialog-delete-confirmtion.component';

@Component({
  selector: 'app-expected-goods-shipment-list',
  templateUrl: './expected-goods-shipment-list.component.html',
  styleUrls: ['./expected-goods-shipment-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpectedGoodsShipmentListComponent 
  extends BaseList<ExpectedGoodsShipment, ExpectedGoodsShipmentService> 
  implements OnInit, AfterViewInit {

  pageCount: number[] = [];
  constructor(public expectedGoodsShipmentService: ExpectedGoodsShipmentService,
              public router: Router,
              public dialog: MatDialog,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) {
    super(router, expectedGoodsShipmentService,
      dialog, snacBar, translateService,
      'FUSE2.ExpectedGoodsShipment',
      ['docNum', 'createDate', 'updateDate', 'reqDueDate', 'reqWeek', 
      'confDueDate', 'confWeek', 'docStatusCode', 'logisticSiteCode', 'seriesID', 'delete'],
      '/expected-goods-shipment/create');
  }

  ngOnInit(): void {
    this.setColumns(['docNum', 'delete']);
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

  delete(item: ExpectedGoodsShipment): void {
    this.openDialog().subscribe(result => {
        if (result === true) {
            super.delete(item, 'EGS_DELETED', 'docNum', 
            null, item.logisticSiteCode);
        }
    });  
  } 

  openDialog(): Observable<boolean> {
      const dialogRef = this.dialog.open(DialogDeleteConfirmtionComponent, {
          minWidth: '250px'
      });

      return dialogRef.afterClosed();
  }

}
