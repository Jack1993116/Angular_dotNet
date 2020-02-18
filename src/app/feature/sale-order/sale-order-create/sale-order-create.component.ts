import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { BaseEditCreate } from 'app/feature/base-components/classes/base-edit-create';
import { SaleOrderService } from '../sale-order.service';
import { SaleOrder } from '../SaleOrder';
import { ERPLogisticSiteService } from 'app/erp-logistic-site/erp-logistic-site.service';

@Component({
  selector: 'app-sale-order-create',
  templateUrl: './sale-order-create.component.html',
  styleUrls: ['./sale-order-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaleOrderCreateComponent 
  extends BaseEditCreate<SaleOrder, SaleOrderService>
  implements OnInit {
  
  constructor(public saleOrderService: SaleOrderService,
              public router: Router,
              public route: ActivatedRoute,
              public snacBar: MatSnackBar,
              public translateService: TranslateService,
              private erpLogisticSiteService: ERPLogisticSiteService) { 
    super(saleOrderService,
      router, route, snacBar, translateService,
      'SALE_ORDER_CREATE',
      '/sale-order');  
  }

  ngOnInit(): void {
    this.entity = new SaleOrder();
    this.entity.docStatusCode = 'P';
    this.entity.erpDocStatus = 'P';
    this.entity.sysRate = 0;
    this.entity.localRate = 0;
    // this.entity.bpDocNum = '1234';
    this.entity.lines = [];
    this.entity.attributes = {};
    // this.entity.attributes[15] = null;
    const checkedERP = this.erpLogisticSiteService
      .getCheckedERP();
    if (checkedERP.length === 1) {
      this.entity.erpCompanyID = checkedERP[0].erpCompanyID;
    }
  }

  save(event: SaleOrder): void {
    const actionToTake = event.docID ? 'edit' : 'create';
    super.save(event, 
      'SALE_ORDER_CREATED', 'docNum', actionToTake,
      1, null);
  }

  uploadFile(file: File): void {
    const actionObservablue = this.saleOrderService.uploadFile(file, 'SalOrd', 
      this.form.get('bpCode').value,
        this.form.get('projectCode').value);
    this.handleEntityUpdateCallBack(actionObservablue, 'docNum');
  }

}
