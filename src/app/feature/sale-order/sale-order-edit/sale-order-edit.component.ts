import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { BaseEditCreate } from 'app/feature/base-components/classes/base-edit-create';
import { SaleOrderService } from '../sale-order.service';
import { SaleOrder } from '../SaleOrder';

@Component({
  selector: 'app-sale-order-edit',
  templateUrl: './sale-order-edit.component.html',
  styleUrls: ['./sale-order-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SaleOrderEditComponent 
  extends BaseEditCreate<SaleOrder, SaleOrderService>
  implements OnInit {

  constructor(public saleOrderService: SaleOrderService,
              public router: Router,
              public route: ActivatedRoute,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) {
    super(saleOrderService,
      router, route, snacBar, translateService,
      'SALE_ORDER_EDIT',
      '/sale-order');
  }

  ngOnInit(): void {
    this.getEntity();
  }

  save(event: SaleOrder): void {
    super.save(event,
      'SALE_ORDER_EDITED', 'docNum', 'edit',
      1, null);
  }
  
  uploadFile(file: File): void {
    const actionObservablue = this.saleOrderService.uploadFile(file, 'SalOrd', 
      this.form.get('bpCode').value,
        this.form.get('projectCode').value);
    this.handleEntityUpdateCallBack(actionObservablue, 'docNum');
  }
}
