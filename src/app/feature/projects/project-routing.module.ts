import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { ProjectsComponent } from './projects/projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { GenericResolverService } from 'app/shared/resolver/generic-resolver.service';
import { Project } from './Project';
import { ProjectsService } from './projects.service';

const PROJECT_RESOLVER = 
    new InjectionToken<GenericResolverService<Project, ProjectsService>>
    ('projectResolver');

const routes: Routes = [
    {
        path: '', component: ProjectsComponent,
        children: [
            {
                path: '', component: ProjectListComponent
            },
            {
                path: 'create', component: ProjectCreateComponent
            },
            { 
                path: ':projectCode', component: ProjectEditComponent,
                resolve: {
                  entity: PROJECT_RESOLVER 
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [{ 
            provide: PROJECT_RESOLVER, 
            useFactory: (service, router, param) => new GenericResolverService(service, router, ['projectCode', 'erpCompanyId']),
            deps: [ProjectsService, Router]
    }]
})
export class ProjectRoutingModule { }
