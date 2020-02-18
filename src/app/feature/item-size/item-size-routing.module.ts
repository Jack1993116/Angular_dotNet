import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { ItemSizeService } from './item-size.service';
import { ItemSizeComponent } from './item-size/item-size.component';
import { ItemSizeListComponent } from './item-size-list/item-size-list.component';
import { ItemSize } from './ItemSize';
import { GenericResolverService } from 'app/shared/resolver/generic-resolver.service';
import { ItemSizeCreateComponent } from './item-size-create/item-size-create.component';
import { ItemSizeEditComponent } from './item-size-edit/item-size-edit.component';

const ITEM_SIZE_RESOLVER = 
    new InjectionToken<GenericResolverService<ItemSize, ItemSizeService>>
    ('itemSizeResolver');


const routes: Routes = [
    {
        path: '', component: ItemSizeComponent,
        children: [
            {
                path: '', component: ItemSizeListComponent
            },
            {
                path: 'create', component: ItemSizeCreateComponent
            }, 
            { 
                path: ':id', component: ItemSizeEditComponent,
                resolve: {
                    entity: ITEM_SIZE_RESOLVER
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
            provide: ITEM_SIZE_RESOLVER, 
            useFactory: (service, router, param) => new GenericResolverService(service, router, ['id']),
            deps: [ItemSizeService, Router]
        }
    ]
})
export class ItemSizeRoutingModule { }
