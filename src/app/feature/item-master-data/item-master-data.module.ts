import { NgModule } from '@angular/core';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from './../base-components/base.module';

import { CookieService } from 'ngx-cookie-service';

import { ItemMasterDataService } from './item-master-data.service';
import { ItemMasterDataRoutingModule } from './item-master-data-routing.module';
import { ItemMasterDataComponent } from './item-master-data/item-master-data.component';
import { ItemMasterDataListComponent } from './item-master-data-list/item-master-data-list.component';
import { ItemMasterDataEditComponent } from './item-master-data-edit/item-master-data-edit.component';
import { ItemMasterDataDetailComponent } from './item-master-data-detail/item-master-data-detail.component';
import { ItemMasterDataCreateComponent } from './item-master-data-create/item-master-data-create.component';
import { IMDGeneralComponent } from './tabs/general/imd-general.component';
import { ItemLogisticSiteComponent } from './tabs/item-logistic-site/item-logistic-site.component';
import { ItemUOMComponent } from './tabs/item-uom/item-uom.component';
import { ItemRevisionComponent } from './tabs/item-revision/item-revision.component';

@NgModule({
    declarations: [
        ItemMasterDataComponent, 
        ItemMasterDataListComponent,
        ItemMasterDataEditComponent, 
        ItemMasterDataDetailComponent, 
        ItemMasterDataCreateComponent, 
        IMDGeneralComponent, 
        ItemLogisticSiteComponent, 
        ItemUOMComponent, 
        ItemRevisionComponent
    ],
    imports: [      
        CoreModule,
        SharedModule,
        BaseModule,
        ItemMasterDataRoutingModule
    ], 
    providers: [
        CookieService,
        
        ItemMasterDataService
    ]
})
export class ItemMasterDataModule { }
