import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { UserService, AuthService, NavService } from '../shared/index';

@Component({
	selector: 'my-users',
	templateUrl: 'client/app/users/users.component.html',
	styles: [`
		.selected {
			background-color: #CFD8DC !important;
			color: white;
		}
		`]
})
export class UsersComponent implements OnInit {
	users: any[];
	selectedUser: any;
	error: any;

	constructor(
		private userService: UserService,
		private authService: AuthService,
		private navService: NavService,
		private router: Router
	) {
	}

	ngOnInit() {
		this.navService.changeTitle('Users');

		this.getUsers();
		this.authService.getLoggedInUser()
		.subscribe((user: any) => {
			this.selectedUser = user;
		})
		//.catch(error => console.error(error));
	}

	getUsers() {
		this.userService.list()
		.then((users: any) => this.users = users);
	}

	getUser(id: string) {
		this.userService.get(id)
		.then(user => this.selectedUser = user);
	}

	deleteUser(user: any, event: any) {
		event.stopPropagation();
		this.userService
			.delete(user._id)
			.catch(error => this.error = error);
	}

	onSelect(user: Object) {
		this.selectedUser = user;
	}

	gotoProfile() {
		this.router.navigate(['/user', this.selectedUser._id]);
	}

	gotoEditProfile(id: string) {
		this.router.navigate(['edit_user', id]);
	}
}
