import { NgModule } from '@angular/core';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from './../base-components/base.module';

import { CookieService } from 'ngx-cookie-service';

import { ExpectedGoodsShipmentService } from './expected-goods-shipment-service';
import { ExpectedGoodsShipmentRoutingModule } from './expected-goods-shipment-routing.module';
import { ExpectedGoodsShipmentComponent } from './expected-goods-shipment/expected-goods-shipment.component';
import { ExpectedGoodsShipmentEditComponent } from './expected-goods-shipment-edit/expected-goods-shipment-edit.component';
import { ExpectedGoodsShipmentCreateComponent } from './expected-goods-shipment-create/expected-goods-shipment-create.component';
import { ExpectedGoodsShipmentDetailComponent } from './expected-goods-shipment-detail/expected-goods-shipment-detail.component';
import { ExpectedGoodsShipmentListComponent } from './expected-goods-shipment-list/expected-goods-shipment-list.component';
import { ExpectedGoodsShipmentGeneralComponent } from './tabs/expected-goods-shipment-general/expected-goods-shipment-general.component';
import { ExpectedGoodsShipmentLinesComponent } from './tabs/expected-goods-shipment-lines/expected-goods-shipment-lines.component';



@NgModule({
  declarations: [
    ExpectedGoodsShipmentComponent, 
    ExpectedGoodsShipmentEditComponent, 
    ExpectedGoodsShipmentCreateComponent, 
    ExpectedGoodsShipmentDetailComponent, 
    ExpectedGoodsShipmentListComponent, ExpectedGoodsShipmentGeneralComponent, ExpectedGoodsShipmentLinesComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    BaseModule,
    ExpectedGoodsShipmentRoutingModule
  ],
  providers: [
    CookieService,
    ExpectedGoodsShipmentService
  ]
})
export class ExpectedGoodsShipmentModule { }
