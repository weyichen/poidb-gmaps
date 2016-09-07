import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService, NavService } from '../shared/index';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {
  private defaultTitle = 'My First Angular 2 + Express App!';

  loggedInUser: Object;
  title: string;
  message: string;

  error: any;

  constructor(
    private router: Router,
    private navService: NavService,
    private authService: AuthService,
    private titleService: Title
  ) {

    /*
      NavigationStart -> RoutesRecognized -> router child component ngInit -> NavigationEnd -> child NavigationEnd
      put anything here that should be refreshed every time the user navigates, keeping in mind the order of events above
      change app title to the default, which will display if child component does not have its own component
    */
    router.events.subscribe(event => {
      if (event.constructor.name === "NavigationStart") {
        this.setTitle(this.defaultTitle);
        this.message = navService.getMessages();
        this.getLoggedInUser();
      }

      // TODO: temporary solution to AuthGuard
      if (event.constructor.name === "NavigationCancel") {
        this.message = "You are not authorized to access this page!";
      }
    })

    /*
      other components will use NavService to change information displayed in the nav bar
      here we subscribe to any calls to those NavService functions
    */
    navService.titleChanged$.subscribe(title => this.setTitle(title));
    navService.messageChanged$.subscribe(message => this.message = message);
    navService.loggedIn$.subscribe(user => this.loggedInUser = user);

  }

  ngOnInit() {

  }

  // sets both the title in the nav bar and the browser window
  setTitle(title: string) {
    this.title = title;
    this.titleService.setTitle(title);
  }

  logout() {
  this.authService.logout()
    .then((response: any) => {
      if (response.ok) {
        this.loggedInUser = null;
      }
    })
    .catch(error => this.error = error);
  }

  getLoggedInUser() {
    this.authService.getLoggedInUser()
    .subscribe((user: any) => {
      this.loggedInUser = user.data;
    },
    (error: any) => {
      this.error = error;
    });
  }
}