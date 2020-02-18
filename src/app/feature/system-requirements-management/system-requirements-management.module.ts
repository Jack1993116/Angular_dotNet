import { NgModule } from '@angular/core';


import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from './../base-components/base.module';

import { CookieService } from 'ngx-cookie-service';

import { SystemRequirementsManagementComponent } from './system-requirements-management/system-requirements-management.component';
import { DemandsGridComponent } from './demands-grid/demands-grid.component';
import { SystemRequirementsManagementRoutingModule } from './system-requirements-management-routing.module';
import { MrpService } from './mrp.service';



@NgModule({
  declarations: [
    SystemRequirementsManagementComponent, 
    DemandsGridComponent],
  imports: [
    CoreModule,
    SharedModule,
    BaseModule,
    SystemRequirementsManagementRoutingModule
  ],
  providers: [
    CookieService,
    MrpService
  ]
})
export class SystemRequirementsManagementModule { }
