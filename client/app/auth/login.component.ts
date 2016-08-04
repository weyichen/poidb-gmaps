import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService, NavService } from '../shared/index';

@Component({
  selector: 'user-login',
  templateUrl: 'client/app/auth/login.component.html',
  styles: []
})

export class LoginComponent implements OnInit {

  @Input() user: Object;
  signupMode: boolean;
  error: any;

  constructor(
    private authService: AuthService,
    private navService: NavService,
    private route: ActivatedRoute
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
      .then(response => this.handleAuthResponse(response))
      .catch(error => this.error = error);
  }

  signUp() {
    this.authService
      .signup(this.user)
      .then(response => this.handleAuthResponse(response))
      .catch(error => this.error = error);
  }

  private handleAuthResponse(response: any) {
    if (response._id) {
      this.navService.logIn(response);
      this.navService.changeMessage('Welcome, ' + response.username);
    } else {
      this.navService.changeMessage(response);
    }
  }
}
