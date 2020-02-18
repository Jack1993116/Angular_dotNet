import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/core/auth.guard';

const routes: Routes = [
    {
        path: '', canActivate: [AuthGuard],
        children: [
            { 
                path: 'item-master-data',
                loadChildren: () => import('./item-master-data/item-master-data.module')
                    .then(mod => mod.ItemMasterDataModule)
            },
            {
                path: 'sale-order',
                loadChildren: () => import('./sale-order/sale-order.module')
                    .then(mod => mod.SaleOrderModule)
            },
            {
                path: 'expected-goods-shipment',
                loadChildren: () => import('./expected-goods-shipment/expected-goods-shipment.module')
                    .then(mod => mod.ExpectedGoodsShipmentModule)
            },
            {
                path: 'system-requirements-management',
                loadChildren: () => import('./system-requirements-management/system-requirements-management.module')
                    .then(mod => mod.SystemRequirementsManagementModule)
            },
            {
                path: 'projects',
                loadChildren: () => import('./projects/projects.module')
                    .then(mod => mod.ProjectsModule)
            },
            {
                path: 'item-group',
                loadChildren: () => import('./item-group/item-group.module')
                    .then(mod => mod.ItemGroupModule)
            },
            {
                path: 'locations',
                loadChildren: () => import('./locations/locations.module')
                    .then(mod => mod.LocationsModule)
            },
            {
                path: 'item-size',
                loadChildren: () => import('./item-size/item-size.module')
                    .then(mod => mod.ItemSizeModule)
            },
            {
                path: 'reveision-type',
                loadChildren: () => import('./revision-type/reveision-type.module')
                    .then(mod => mod.ReveisionTypeModule)
            }
            
        ]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule { }
