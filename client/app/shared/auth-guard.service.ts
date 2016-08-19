import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  error: any;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.authService.getLoggedInUserObservable()
      .map((response: any) => {
        if (response.logged_in) {
          return true;
        } else {
          return false;
        }
      });
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  error: any;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.authService.getLoggedInUserObservable()
      .map((response: any) => {
        if (response.logged_in && response.user.admin) {
          return true;
        } else {
          return false;
        }
      });
  }
}
