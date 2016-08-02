import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserService } from './users/user.service';
import { AuthService } from './auth/auth.service';
import { NavService } from './nav/nav.service';

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
export class AppComponent implements OnInit{
  constructor(
    private router: Router,
    private navService: NavService
  ) {
    navService.titleChanged$.subscribe(title => this.title = title);
  }

  title: string;

  ngOnInit() {
    this.title = 'My First Angular 2 + Express App!';

  }
}
