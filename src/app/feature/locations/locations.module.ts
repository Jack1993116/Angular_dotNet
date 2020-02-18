import { NgModule } from '@angular/core';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';
import { BaseModule } from './../base-components/base.module';

import { CookieService } from 'ngx-cookie-service';

import { LocationsService} from './locations.service';
import { LocationRoutingModule } from './location-routing.module';
import { LocationsComponent } from './locations/locations.component';
import { LocationsListComponent } from './locations-list/locations-list.component';



@NgModule({
  declarations: [
    LocationsComponent, 
    LocationsListComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    BaseModule,
    LocationRoutingModule
  ],
  providers: [
    CookieService,

    LocationsService
  ]
})
export class LocationsModule { }
