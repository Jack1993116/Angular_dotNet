import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { ItemGroupComponent } from './item-group/item-group.component';
import { ItemGroupTreeComponent } from './item-group-tree/item-group-tree.component';

const routes: Routes = [
    {
        path: '', component: ItemGroupComponent,
        children: [
            {
                path: '', component: ItemGroupTreeComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemGroupRoutingModule { }
