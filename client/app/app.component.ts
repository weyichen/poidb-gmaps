import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService, AuthService, NavService } from './shared/index';

import { UsersComponent } from './users/users.component';
import { UserProfileComponent } from './users/user-profile.component';
import { LoginComponent } from './auth/login.component';

@Component({
  selector: 'my-app',
  templateUrl: 'client/app/app.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [UserService, AuthService, NavService],
  precompile: [UsersComponent, UserProfileComponent, LoginComponent]
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private navService: NavService,
    private authService: AuthService
  ) {
    navService.titleChanged$.subscribe(title => this.title = title);
    navService.messageChanged$.subscribe(message => this.message = message);
    navService.loggedIn$.subscribe(user => this.loggedInUser = user);
  }

  loggedInUser: Object;
  title: string;
  message: string;

  error: any;

  ngOnInit() {
    this.title = 'My First Angular 2 + Express App!';

    // if a user is logged in, get it
    this.loggedInUser = this.authService.getLoggedInUser();
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.loggedInUser = null;
        this.navService.changeMessage('Successfully logged out. See you next time!');
      })
      .catch(error => this.error = error);
  }
}
