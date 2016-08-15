import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, NavService } from '../shared/index';

@Component({
	selector: 'app-nav',
	templateUrl: 'client/app/nav/nav.component.html'
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
		private authService: AuthService
	) {

		/*
			NavigationStart -> RoutesRecognized -> router child component ngInit -> NavigationEnd -> child NavigationEnd
			put anything here that should be refreshed every time the user navigates, keeping in mind the order of events above
			change app title to the default, which will display if child component does not have its own component
		*/
		router.events.subscribe(event => {
			if (event.constructor.name === "NavigationStart") {
				this.title = this.defaultTitle;
				this.message = navService.getMessages();
				this.getLoggedInUser();
			}
		})

		/*
			other components will use NavService to change information displayed in the nav bar
			here we subscribe to any calls to those NavService functions
		*/
		navService.titleChanged$.subscribe(title => this.title = title);
		navService.messageChanged$.subscribe(message => this.message = message);
		navService.loggedIn$.subscribe(user => this.loggedInUser = user);

	}

	ngOnInit() {

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
			else
				this.loggedInUser = null;
			})
		.catch(error => this.error = error);
	}
}