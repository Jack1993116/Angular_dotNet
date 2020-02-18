import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InternalErrorComponent } from './internal-error/internal-error.component';

const routes: Routes = [
  {
    path: 'error', component: ErrorComponent,
    children: [
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: 'not-found', component: NotFoundComponent },
      { path: 'internal-error', component: InternalErrorComponent }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
