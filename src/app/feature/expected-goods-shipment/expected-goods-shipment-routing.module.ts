import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { ExpectedGoodsShipmentComponent } from './expected-goods-shipment/expected-goods-shipment.component';
import { ExpectedGoodsShipmentEditComponent } from './expected-goods-shipment-edit/expected-goods-shipment-edit.component';
import { ExpectedGoodsShipmentCreateComponent } from './expected-goods-shipment-create/expected-goods-shipment-create.component';
import { ExpectedGoodsShipmentListComponent } from './expected-goods-shipment-list/expected-goods-shipment-list.component';
import { ExpectedGoodsShipmentService } from './expected-goods-shipment-service';
import { GenericResolverService } from 'app/shared/resolver/generic-resolver.service';
import { ExpectedGoodsShipment } from './ExpectedGoodsShipment';
import { SaleOrder } from '../sale-order/SaleOrder';

const EXPECTED_GOODS_SHIPMENT_RESOLVER =
    new InjectionToken<GenericResolverService<ExpectedGoodsShipment, ExpectedGoodsShipmentService>>
    ('expectedGoods');

const routes: Routes = [
    {
        path: '', component: ExpectedGoodsShipmentComponent,
        children: [
            {
                path: '', component: ExpectedGoodsShipmentListComponent
            },
            {
                path: 'create', component: ExpectedGoodsShipmentCreateComponent
            },
            // {
            //     path: 'create', component: ExpectedGoodsShipmentCreateComponent,
            //         data: {saleOrder: SaleOrder}
            // },
            { 
                path: ':docId/:logisticSiteCode', component: ExpectedGoodsShipmentEditComponent,
                resolve: {
                  entity: EXPECTED_GOODS_SHIPMENT_RESOLVER 
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [{
        provide: EXPECTED_GOODS_SHIPMENT_RESOLVER,
        useFactory: (service, router, param) => new GenericResolverService(service, router, ['docId' , 'logisticSiteCode']),
        deps: [ExpectedGoodsShipmentService]
    }]
})
export class ExpectedGoodsShipmentRoutingModule { }
