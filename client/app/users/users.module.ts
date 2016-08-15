import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { UsersComponent } from './users.component';
import { UserProfileComponent } from './user-profile.component';
import { ProfileEditComponent } from './profile-edit.component';

import { SharedModule } from '../shared/shared.module';

import { AuthService, AuthGuard, NavService, UserService } from '../shared/index';

import { usersRouting } from './users.routing';

@NgModule({
	declarations: [
		UsersComponent,
		UserProfileComponent,
		ProfileEditComponent
	],
	imports: [
		SharedModule,
		usersRouting
	]
})
export class UsersModule {}
