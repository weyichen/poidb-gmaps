import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService, AuthGuard, NavService, UserService } from './shared/index';

@Component({
  selector: 'my-app',
  templateUrl: 'client/app/app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private navService: NavService,
    private authService: AuthService
  ) {

    // router navigation events
    router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        navService.changeTitle('My First Angular 2 + Express App!');
        // navService.changeMessage(null);
      }
    })

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

    this.getLoggedInUser();
  }

  logout() {
    this.authService
      .logout()
      .then((response: any) => {
        if (response.logged_out) {
          this.loggedInUser = null;
          this.navService.changeMessage('Successfully logged out. See you next time!');
        } else {
          this.navService.changeMessage('Error logging out!');
        }
      })
      .catch(error => this.error = error);
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser()
      .then((response: any) => {
        if (response.logged_in)
          this.loggedInUser = response.user;
        })
      .catch(error => this.error = error);
  }
}
