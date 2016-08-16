import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { UserProfileComponent } from './user-profile.component';
import { ProfileEditComponent } from './profile-edit.component';

import { SharedModule } from '../shared/shared.module';

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
