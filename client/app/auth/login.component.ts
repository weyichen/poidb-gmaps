import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'user-login',
  templateUrl: 'client/app/auth/login.component.html',
  styles: []
})

export class LoginComponent implements OnInit, OnDestroy {
  @Input() user: Object;
  @Output() close = new EventEmitter();

  signupMode: boolean;

  error: any;
  sub: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = {};
    this.signupMode = false;
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
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
      .then(user => console.log(user)) // TODO: where to store this user object to preserve session?
      .catch(error => this.error = error);
  }

  // TODO:
  signUp() {
    this.authService
      .signup(this.user)
      .then(user => console.log(user))
      .catch(error => this.error = error);
  }
}
