import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import '../assets/css/styles.css';

import { AuthService, AuthGuard, NavService, UserService } from './shared/index';

@Component({
	selector: 'my-app',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

	constructor(
		private router: Router,
		private navService: NavService,
		private authService: AuthService
	) {

	}

	ngOnInit() {
	}


}
