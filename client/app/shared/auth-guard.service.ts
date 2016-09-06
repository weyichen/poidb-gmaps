import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/do';

import { AuthService } from './index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  error: any;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    //return true;

    return this.authService.getLoggedInUser()
      .map((response: any) => {
        if (response.ok) {
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

    return this.authService.getLoggedInUser()
      .map((response: any) => {
        if (response.ok && response.data.admin) {
          return true;
        } else {
          return false;
        }
      });
  }
}
