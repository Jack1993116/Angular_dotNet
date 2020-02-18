import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { BaseEditCreate } from 'app/feature/base-components/classes/base-edit-create';
import { ExpectedGoodsShipmentService } from '../expected-goods-shipment-service';
import { ExpectedGoodsShipment } from '../ExpectedGoodsShipment';
import { ExpectedGoodsShipmentDetailComponent } from '../expected-goods-shipment-detail/expected-goods-shipment-detail.component';


@Component({
  selector: 'app-expected-goods-shipment-edit',
  templateUrl: './expected-goods-shipment-edit.component.html',
  styleUrls: ['./expected-goods-shipment-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExpectedGoodsShipmentEditComponent 
  extends BaseEditCreate<ExpectedGoodsShipment, ExpectedGoodsShipmentService>
  implements OnInit {

  constructor(public expectedGoodsShipmentService: ExpectedGoodsShipmentService,
              public router: Router,
              public route: ActivatedRoute,
              public snacBar: MatSnackBar,
              public translateService: TranslateService) { 
      super(expectedGoodsShipmentService,
        router, route, snacBar, translateService,
        'EGS_EDIT',
        '/expected-goods-shipment');
  }

  ngOnInit(): void {
    this.getEntity();
  }

  save(event: ExpectedGoodsShipment): void {
    super.save(event, 
      'EGS_EDITED', 'docNum', 'edit',
      null, event.logisticSiteCode);
  }
}
