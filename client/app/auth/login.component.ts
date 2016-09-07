import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, NavService } from '../shared/index';

@Component({
  selector: 'user-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent implements OnInit {

  user: Object;
  signupMode: boolean;
  error: any;

  constructor(
    private authService: AuthService,
    private navService: NavService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = {};
    this.signupMode = false;
  }

  toggleMode() {
    if (this.signupMode)
      this.signupMode = false;
    else
      this.signupMode = true;
  }

  login() {
    this.authService
      .login(this.user)
      .catch(error => this.error = error);
  }

  signUp() {
    this.authService
      .signup(this.user)
      .catch(error => this.error = error);
  }

}
