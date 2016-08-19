import { Routes, RouterModule } from '@angular/router';

import { ProfileEditComponent, UserProfileComponent, UsersComponent } from './index';

import { AuthGuard, AdminGuard, AuthService, NavService } from '../shared/index';

const routes: Routes = [
	{
		path: 'users',
		component: UsersComponent
	},
	{
		path: 'user/:id',
		component: UserProfileComponent
	},
	{
		path: 'edit_user/:id',
		component: ProfileEditComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'editprofile',
		component: ProfileEditComponent,
		canActivate: [AuthGuard]
	}
];

export const usersRouting = RouterModule.forChild(routes);