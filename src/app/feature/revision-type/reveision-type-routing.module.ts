import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { ReveisionTypeService } from './reveision-type.service';
import { ReveisionTypeComponent } from './reveision-type/reveision-type.component';
import { ReveisionTypeListComponent } from './reveision-type-list/reveision-type-list.component';
import { ReveisionType } from './ReveisionType';
import { GenericResolverService } from 'app/shared/resolver/generic-resolver.service';
import { ReveisionTypeCreateComponent } from './reveision-type-create/reveision-type-create.component';
import { ReveisionTypeEditComponent } from './reveision-type-edit/reveision-type-edit.component';

const REVEIOSION_TYPE_RESOLVER = 
    new InjectionToken<GenericResolverService<ReveisionType, ReveisionTypeService>>
    ('ReveisionTypeResolver');


const routes: Routes = [
    {
        path: '', component: ReveisionTypeComponent,
        children: [
            {
                path: '', component: ReveisionTypeListComponent
            },
            {
                path: 'create', component: ReveisionTypeCreateComponent
            }, 
            { 
                path: ':id', component: ReveisionTypeEditComponent,
                resolve: {
                    entity: REVEIOSION_TYPE_RESOLVER
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
            provide: REVEIOSION_TYPE_RESOLVER, 
            useFactory: (service, router, param) => new GenericResolverService(service, router, ['id']),
            deps: [ReveisionTypeService, Router]
        }
    ]
})
export class ReveisionTypeRoutingModule { }
