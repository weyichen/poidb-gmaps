import { Routes, RouterModule } from '@angular/router';

import { ProfileEditComponent, UserProfileComponent, UsersComponent } from './index';

import { AuthGuard, AuthService, NavService } from '../shared/index';

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
		path: 'editprofile/:id',
		component: UserProfileComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'editprofile',
		component: ProfileEditComponent,
		canActivate: [AuthGuard]
	}
];

export const usersRouting = RouterModule.forChild(routes);