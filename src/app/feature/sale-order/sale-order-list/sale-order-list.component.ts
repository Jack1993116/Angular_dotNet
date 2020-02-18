import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { BaseList } from 'app/feature/base-components/classes/base-list';
import { SaleOrder } from '../SaleOrder';
import { SaleOrderService } from '../sale-order.service';
import { DialogDeleteConfirmtionComponent } from 'app/shared/components/dialog-delete-confirmtion/dialog-delete-confirmtion.component';

@Component({
  selector: 'app-sale-order-list',
  templateUrl: './sale-order-list.component.html',
  styleUrls: ['./sale-order-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaleOrderListComponent 
  extends BaseList<SaleOrder, SaleOrderService>
  implements OnInit, AfterViewInit {

  pageCount: number[] = [];

  constructor(public router: Router,
              public saleOrderService: SaleOrderService,
              public dialog: MatDialog,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) { 
    super(router, saleOrderService, dialog, snacBar, translateService,
      'FUSE2.SaleOrder', ['docNum', 'bpCode',
      'bpDocNum', 'bpName', 'docStatusCode', 'erpDocNum',
       'erpDocStatus', 'seriesID', 'createDate', 'updateDate', 'delete'],
      'sale-order/create');
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

  delete(item: SaleOrder): void {
    this.openDialog().subscribe(result => {
        if (result === true) {
            super.delete(item, 'SALE_ORDER_DELETED', 'docNum', 
               item.erpCompanyID);
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
