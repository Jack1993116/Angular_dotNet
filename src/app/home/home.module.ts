import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

@NgModule({
  imports: [
      CommonModule,
      MatButtonModule,
      MatIconModule,
      TranslateModule,

      FuseSharedModule,

      HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    CounterComponent,
    FetchDataComponent
  ]
})
export class HomeModule { }
