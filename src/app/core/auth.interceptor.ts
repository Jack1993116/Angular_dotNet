import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Constants } from '../constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private _authService: AuthService, private _router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(Constants.clientRoot)) {
      const accessToken = this._authService.getAccessToken();
      const headers = req.headers
        .set('Authorization', `Bearer ${accessToken}`);
      const authReq = req.clone({ headers });
      return next.handle(authReq)
        .pipe(
          tap(() => { }, error => {
          const respError = error as HttpErrorResponse;
          if (respError) {
            if (respError.status === 401) {
              this._router.navigate(['./login']);
            } else if (respError.status === 403) {
              this._router.navigate(['./error/unauthorized']);
            } else if (respError.status === 404) {
              this._router.navigate(['./error/not-found']);
            } else if (respError.status === 500) {
              this._router.navigate(['./error/internal-error']);
            }
          }
      }));
    } else {
      return next.handle(req);
    }
  }
}
