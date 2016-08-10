import { Routes, RouterModule } from '@angular/router';

import { ProfileEditComponent, UserProfileComponent, UsersComponent } from './users/index';
import { LoginComponent } from './auth/login.component';

import { AuthGuard, AuthService, NavService } from './shared/index';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
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
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: 'users'
    //component: PageNotFoundComponent
  }
];

export const routing = RouterModule.forRoot(routes);
