import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
// import { UserManager, User, WebStorageStateStore } from 'oidc-client';
import { UserProfile, AppUser, LoginResponse } from '../model/user-profile';

import { Constants } from '../constants';
import { AuthContext } from '../model/auth-context';
import { of, Observable } from 'rxjs';
import { promise } from 'protractor';
import { userInfo } from 'os';

@Injectable()
export class AuthService {
  // private _userManager: UserManager;
  private _user: AppUser;
  private _login: LoginResponse;
  public authContext: AuthContext;
  private baseApi: string;
  redirectUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseApi = `${Constants.clientRoot}api/Account`;

    // var config = {
    //   authority: Constants.stsAuthority,
    //   client_id: 'spa-client',
    //   redirect_uri: `${Constants.clientRoot}assets/oidc-login-redirect.html`,
    //   scope: 'openid projects-api profile',
    //   response_type: 'id_token token',
    //   post_logout_redirect_uri: `${Constants.clientRoot}`,
    //   userStore: new WebStorageStateStore({ store: window.localStorage })
    // };
    // this._userManager = new UserManager(config);

    // this._userManager.getUser().then(user => {
    //   if (user && !user.expired) {
    //     this._user = user;
    //     this.loadSecurityContet();
    //   }
    // });

    // this._userManager.events.addUserLoaded(() => {
    //   this._userManager.getUser().then(user => {
    //     this._user = user;
    //     this.loadSecurityContet();
    //   })
    // });
    // this._user = Object.assign(new UserProfile(), {
    //   userName: 'User 1',
    //   userId: 1
    // });
  }

  login(user: AppUser): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${this.baseApi}/Login`, user)
      .pipe(
        tap(data => {
          if (data) {
            this._user = Object.assign(user);
            this._login = Object.assign(data);
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_name', user.userCode);
          }
        })
      );
  }

  logout(): Observable<any> {
   return this.httpClient.post(`${this.baseApi}/Logout`, {});
  }

  clearUserAndStorage(): void {
    this._user = null;
    this._login = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
  }
  
  isLoggedIn(): boolean {
    if (this._user) {
      return true;
    } else {
      const userCodeStored = localStorage.getItem('user_name');
      const login = localStorage.getItem('auth_token');
      if (login && userCodeStored) {
        this._user = Object.assign(new UserProfile(), {
          userCode: userCodeStored,
          password: ''
        });
        this._login = Object.assign(new LoginResponse(), {
          token: login
        });
        return true;
      }
    }
    return this._user != null;
    //   && this._user.access_token
    //   && !this._user.expired;
  }

  getAccessToken(): string {
    return (this._user && this.login) ? this._login.token : '';
  }

  signoutRedirectCallback(): Promise<any> {
    // return this._userManager.signoutRedirectCallback();
    return of('').toPromise();
  }

  loadSecurityContet(): void {
    // this.httpClient.get<AuthContext>(`${Constants.clientRoot}api/Account/AuthContext`)
    //   .subscribe(context => {
    //     this.authContext = context;
    //   }, error => console.log(error));
  }

  public getUserName(): string{
    if (this.isLoggedIn()){
      return this._user.userCode;
    }
  }
}
