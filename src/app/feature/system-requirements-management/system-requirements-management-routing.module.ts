import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemRequirementsManagementComponent } from './system-requirements-management/system-requirements-management.component';
import { DemandsGridComponent } from './demands-grid/demands-grid.component';

const routes: Routes = [
    {
        path: '', component: SystemRequirementsManagementComponent,
        children: [
            {
                path: '', component: DemandsGridComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemRequirementsManagementRoutingModule { }
