import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { ItemMasterDataComponent } from './item-master-data/item-master-data.component';
import { ItemMasterDataListComponent } from './item-master-data-list/item-master-data-list.component';
import { ItemMasterDataEditComponent } from './item-master-data-edit/item-master-data-edit.component';
import { ItemMasterData } from './ItemMasterData';
import { ItemMasterDataService } from './item-master-data.service';
import { ItemMasterDataCreateComponent } from './item-master-data-create/item-master-data-create.component';
import { GenericResolverService } from 'app/shared/resolver/generic-resolver.service';

const ITEM_RESOLVER = 
    new InjectionToken<GenericResolverService<ItemMasterData, ItemMasterDataService>>
    ('itemResolver');

const routes: Routes = [
    {
        path: '', component: ItemMasterDataComponent,
        children: [
            {
                path: '', component: ItemMasterDataListComponent
            },
            {
                path: 'create', component: ItemMasterDataCreateComponent
            }, 
            { 
                path: ':id', component: ItemMasterDataEditComponent,
                resolve: {
                    entity: ITEM_RESOLVER
                } 
            },     
        ]
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        { 
            provide: ITEM_RESOLVER, 
            useFactory: (service, router, param) => new GenericResolverService(service, router, ['id']),
            deps: [ItemMasterDataService, Router]
        }
    ]
})
export class ItemMasterDataRoutingModule { }
