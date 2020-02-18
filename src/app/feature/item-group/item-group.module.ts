import { NgModule } from '@angular/core';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from './../base-components/base.module';
import { MatTreeModule } from '@angular/material';

import { CookieService } from 'ngx-cookie-service';

import { ItemGroupService } from './item-group.service';
import { ItemGroupComponent } from './item-group/item-group.component';
import { ItemGroupTreeComponent } from './item-group-tree/item-group-tree.component';
import { ItemGroupRoutingModule } from './item-group-routing.module';
import { ItemGroupFormComponent } from './item-group-tree/item-group-form/item-group-form.component';



@NgModule({
  declarations: [
        ItemGroupComponent, 
        ItemGroupTreeComponent, 
        ItemGroupFormComponent
      ],
  imports: [
        CoreModule,
        SharedModule,
        BaseModule,
        MatTreeModule,
        ItemGroupRoutingModule
      ],
  providers: [
        CookieService,

        ItemGroupService
      ]
})
export class ItemGroupModule { }
