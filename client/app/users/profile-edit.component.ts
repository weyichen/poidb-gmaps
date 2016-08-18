import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService, AuthService, NavService } from '../shared/index';

@Component({
	selector: 'profile-edit',
	templateUrl: 'client/app/users/profile-edit.component.html',
	styles: []
})

export class ProfileEditComponent implements OnInit {
	@Input() user: any;

	// admin can include an id parameter and edit any user
	adminMode = false;

	error: any;
	sub: any;

	constructor(
		private userService: UserService,
		private navService: NavService,
		private route: ActivatedRoute,
		private authService: AuthService
	) {
	}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			if (params['id'] !== undefined) {
				this.adminMode = true;
				let id = params['id'];
				this.userService.get(id)
					.then(user => {
						this.user = user;
						this.navService.changeTitle('Editing user ' + user.username);
					});
			} else {
				this.adminMode = false;
				/* TODO: temporary workaround to duplicate api route /loggedinuser2
					call to /loggedinuser does not work unless two in a row are made
					doesn't work even after removing the two immediately preceeding calls:
					in app.component and auth-guard
				*/
				this.authService.getLoggedInUser2()
					.then((response: any) => {
						this.user = response.user;
						this.navService.changeTitle('Editing your profile');
					})
					.catch(error => this.error = error);
				this.user = null;
			}
		});

	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	save(form: any) {

		this.userService
			.put(form, this.user._id)
			.then((res: any) => {
				if (res.update_ok)
					this.navService.changeMessage("Saved changes successfully.")
				else
					this.navService.changeMessage("Error saving changes.")
			})
			.catch(error => this.error = error);
	}

	// goBack(savedHero: Hero = null) {
	//   this.close.emit(savedHero);
	//   if (this.navigated)
	//     window.history.back();
	// }
}
