import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanLoad,
  Route, UrlSegment, ActivatedRouteSnapshot,
  RouterStateSnapshot, UrlTree, Router,
  NavigationExtras
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate,
  CanActivateChild, CanLoad {

  constructor(private _authService: AuthService,
              private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
    // Role based guard
    // ToDo *refactor the contex check into the auth service
    // * try creating a per screan role check
    // * the redirect is not working properlly 
    // return this._authService.authContext &&
    //  this._authService.authContext.claims &&
    //  this._authService.authContext.claims.find(c =>
    //  c.value === 'http://schemas.microsoft.com/ws/2008/06/identity/role' &&
    //  c.type === 'Admin')
  }

  checkLogin(url: string): boolean {
    if (this._authService.isLoggedIn()) {
      return true;
    }

    this._authService.redirectUrl = url;
    const sessionId = 123456789;
    const navigationExtras: NavigationExtras = {
      queryParams: { session_id: sessionId },
      fragment: 'anchor'
    };

    this.router.navigate(['./login'], navigationExtras);
    return false;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }
}
