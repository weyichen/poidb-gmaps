import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService, NavService } from './index';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    console.log('AuthGuard#canActivate called');
    return true;
  }
}
