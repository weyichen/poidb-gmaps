import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService, NavService } from './index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  error: any;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('AuthGuard called');

    return this.authService.getLoggedInUserObservable()
      .map((response: any) => {
        if (response.logged_in) {
          return true;
        } else {
          return false;
        }
      });

      // .then((response: any) => {
      //   if (response.logged_in) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // })
      // .catch(error => this.error = error);
  }
}
