import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
  selector: 'user-login',
  templateUrl: 'client/components/user-login.component.html',
  styles: [],
  precompile: [UserLoginComponent]
})

export class UserLoginComponent implements OnInit, OnDestroy {
  @Input() user: Object;
  @Output() close = new EventEmitter();

  signup: boolean;

  error: any;
  sub: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.user = {};
    this.signup = false;
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  login() {
    this.userService
      .login(this.user)
      .then(user => console.log(user)) // TODO: where to store this user object to preserve session?
      .catch(error => this.error = error);
  }

  // TODO:
  signUp() {
    this.userService
      .put(this.user)
      .then(user => {
        this.user = user;
      })
      .catch(error => this.error = error);
  }
}
