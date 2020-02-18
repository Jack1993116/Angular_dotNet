import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { LocationsComponent } from './locations/locations.component';
import { LocationsListComponent } from './locations-list/locations-list.component';

const routes: Routes = [
    {
        path: '', component: LocationsComponent,
        children: [
            {
                path: '', component: LocationsListComponent
            } 
        ]
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LocationRoutingModule { }
