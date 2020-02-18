import { NgModule } from '@angular/core';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from './../base-components/base.module';

import { CookieService } from 'ngx-cookie-service';

import { ItemSizeService } from './item-size.service';
import { ItemSizeComponent } from './item-size/item-size.component';
import { ItemSizeListComponent } from './item-size-list/item-size-list.component';
import { ItemSizeEditComponent } from './item-size-edit/item-size-edit.component';
import { ItemSizeCreateComponent } from './item-size-create/item-size-create.component';
import { ItemSizeDetailComponent } from './item-size-detail/item-size-detail.component';
import { ItemSizeRoutingModule } from './item-size-routing.module';



@NgModule({
  declarations: [
    ItemSizeComponent, 
    ItemSizeListComponent, 
    ItemSizeEditComponent, 
    ItemSizeCreateComponent, 
    ItemSizeDetailComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    BaseModule,
    ItemSizeRoutingModule
  ],
  providers: [
    CookieService,
    
    ItemSizeService
  ]
})
export class ItemSizeModule { }
