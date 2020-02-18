import { NgModule } from '@angular/core';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from '../base-components/base.module';

import { CookieService } from 'ngx-cookie-service';

import { ReveisionTypeRoutingModule } from './reveision-type-routing.module';
import { ReveisionTypeService } from './reveision-type.service';
import { ReveisionTypeComponent } from './reveision-type/reveision-type.component';
import { ReveisionTypeListComponent } from './reveision-type-list/reveision-type-list.component';
import { ReveisionTypeEditComponent } from './reveision-type-edit/reveision-type-edit.component';
import { ReveisionTypeCreateComponent } from './reveision-type-create/reveision-type-create.component';
import { ReveisionTypeDetailComponent } from './reveision-type-detail/reveision-type-detail.component';



@NgModule({
  declarations: [
    ReveisionTypeComponent, 
    ReveisionTypeListComponent, 
    ReveisionTypeEditComponent, 
    ReveisionTypeCreateComponent, 
    ReveisionTypeDetailComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    BaseModule,
    ReveisionTypeRoutingModule
  ],
  providers: [
    CookieService,
    
    ReveisionTypeService
  ]
})
export class ReveisionTypeModule { }
