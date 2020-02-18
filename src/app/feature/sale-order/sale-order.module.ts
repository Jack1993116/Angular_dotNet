import { NgModule } from '@angular/core';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from './../base-components/base.module';
import { MatTreeModule, MatProgressBarModule } from '@angular/material';
import { IgxTreeGridModule } from 'igniteui-angular';
import { CookieService } from 'ngx-cookie-service';

import { SaleOrderService } from './sale-order.service';
import { SaleOrderRoutingModule } from './sale-order-routing.module';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderEditComponent } from './sale-order-edit/sale-order-edit.component';
import { SaleOrderCreateComponent } from './sale-order-create/sale-order-create.component';
import { SaleOrderDetailComponent } from './sale-order-detail/sale-order-detail.component';
import { SaleOrderListComponent } from './sale-order-list/sale-order-list.component';
import { SaleOrderGeneralComponent } from './tabs/sale-order-general/sale-order-general.component';
import { BOMComponent } from './tabs/bom/bom.component';
import { LineUnitCodeComponent } from './tabs/line-unit-code/line-unit-code.component';
import { BOMFormComponent } from './tabs/bom/bom-form/bom-form.component';
import { SaleOrderLinesComponent } from './tabs/sale-order-lines/sale-order-lines.component';
import { QuantityComponent } from './tabs/sale-order-lines/quantity/quantity.component';
import { BomTreeComponent } from './tabs/bom/bom-tree/bom-tree.component';

@NgModule({
  declarations: [
    SaleOrderComponent, 
    SaleOrderEditComponent, 
    SaleOrderCreateComponent, 
    SaleOrderDetailComponent, 
    SaleOrderListComponent, 
    SaleOrderGeneralComponent, 
    BOMComponent, 
    LineUnitCodeComponent, 
    BOMFormComponent, 
    SaleOrderLinesComponent, 
    QuantityComponent, BomTreeComponent
  ],
  imports: [         
    CoreModule,
    SharedModule,
    BaseModule,
    MatTreeModule,
    MatProgressBarModule,
    SaleOrderRoutingModule,
    
    IgxTreeGridModule
  ],
  providers: [
    CookieService,
    SaleOrderService
  ]
})
export class SaleOrderModule { 
  
}
