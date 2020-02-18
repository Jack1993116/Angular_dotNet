import { NgModule } from '@angular/core';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from './../base-components/base.module';
import { CookieService } from 'ngx-cookie-service';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';



@NgModule({
  declarations: [
    ProjectsComponent, 
    ProjectListComponent, 
    ProjectEditComponent, 
    ProjectCreateComponent, 
    ProjectDetailComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    BaseModule,
    ProjectRoutingModule
  ], 
  providers: [
    CookieService
  ]
})
export class ProjectsModule { }
