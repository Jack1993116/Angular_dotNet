import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatFileUploadModule } from './attachment/mat-file-upload/matFileUpload.module';

import { ContentRouterFrameComponent } from './components/content-router-frame/content-router-frame.component';
import { FormButtonRowComponent } from './components/form-button-row/form-button-row.component';
import { TableTabComponent } from './components/table-tab/table-tab.component';
import { SharedModule } from 'app/shared/shared.module';
import { BpSearchComponent } from './components/bp-search/bp-search.component';
import { ItemSearchComponent } from './components/item-search/item-search.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CurrenciesComponent } from './components/currencies/currencies.component';
import { LogisticSitesComponent } from './components/logistic-sites/logistic-sites.component';
import { ItemRevisionsComponent } from './components/item-revisions/item-revisions.component';
import { UnitsComponent } from './components/units/units.component';
import { UnitsFormFieldComponent } from './components/units-form-field/units-form-field.component';
import { ReportsComponent } from './components/reports/reports.component';
import { PriceListComponent } from './components/price-list/price-list.component';
import { FormHeaderPlugComponent } from './components/header-plug-in/form-header-plug/form-header-plug.component';
import { GridHeaderPlugComponent } from './components/header-plug-in/grid-header-plug/grid-header-plug.component';
import { AttachmentDialogComponent } from './attachment/attachment-dialog/attachment-dialog.component';
import { AttachmentComponent } from './attachment/attachment.component';

@NgModule({
  declarations: [
    ContentRouterFrameComponent,
    FormButtonRowComponent,
    TableTabComponent,
    BpSearchComponent,
    ItemSearchComponent,
    ProjectsComponent,
    CurrenciesComponent,
    LogisticSitesComponent,
    ItemRevisionsComponent,
    UnitsComponent,
    UnitsFormFieldComponent,
    ReportsComponent,
    PriceListComponent,
    FormHeaderPlugComponent,
    GridHeaderPlugComponent,
    AttachmentComponent,
    AttachmentDialogComponent
  ],
  imports: [
 
    RouterModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    
    SharedModule,
    MatFileUploadModule
  ],
  entryComponents: [
    AttachmentDialogComponent
  ],
  exports: [
    ContentRouterFrameComponent,
    FormButtonRowComponent,
    TableTabComponent,
    BpSearchComponent,
    ItemSearchComponent,
    ProjectsComponent,
    CurrenciesComponent,
    LogisticSitesComponent,
    ItemRevisionsComponent,
    UnitsComponent,
    UnitsFormFieldComponent,
    ReportsComponent,
    PriceListComponent,
    FormHeaderPlugComponent,
    GridHeaderPlugComponent,
    AttachmentComponent,
    AttachmentDialogComponent
  ]
})
export class BaseModule { }
