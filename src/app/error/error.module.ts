import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { ErrorRoutingModule } from './error-routing.module';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InternalErrorComponent } from './internal-error/internal-error.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,

    FuseSharedModule,
    
    ErrorRoutingModule
  ],
  declarations: [
    UnauthorizedComponent,
    NotFoundComponent,
    InternalErrorComponent,
    ErrorComponent
    ]
})
export class ErrorModule { }
