import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderListComponent } from './sale-order-list/sale-order-list.component';
import { SaleOrderEditComponent } from './sale-order-edit/sale-order-edit.component';
import { SaleOrderCreateComponent } from './sale-order-create/sale-order-create.component';
import { GenericResolverService } from 'app/shared/resolver/generic-resolver.service';
import { SaleOrder } from './SaleOrder';
import { SaleOrderService } from './sale-order.service';

const SALE_ORDER_RESOLVER = 
    new InjectionToken<GenericResolverService<SaleOrder, SaleOrderService>>
    ('saleOrderResolver');

const routes: Routes = [
    {
        path: '', component: SaleOrderComponent,
        children: [
            {
                path: '', component: SaleOrderListComponent
            },
            {
                path: 'create', component: SaleOrderCreateComponent
            },
            { 
                path: ':docId/:erpCompanyId', component: SaleOrderEditComponent,
                resolve: {
                  entity: SALE_ORDER_RESOLVER 
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [{ 
            provide: SALE_ORDER_RESOLVER, 
            useFactory: (service, router, param) => new GenericResolverService(service, router, ['docId' , 'erpCompanyId']),
            deps: [SaleOrderService, Router]
    }]
})
export class SaleOrderRoutingModule { }
