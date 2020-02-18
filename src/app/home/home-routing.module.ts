import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'counter', component: CounterComponent, canActivate: [AuthGuard] },
  { path: 'fetch-data', component: FetchDataComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
