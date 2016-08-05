import { provideRouter, RouterConfig } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

import { ProfileEditComponent, UserProfileComponent, UsersComponent } from './users/index';
import { LoginComponent } from './auth/login.component';

import { AuthGuard, AuthService, NavService } from './shared/index';

const routes: RouterConfig = [
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

export const appRouterProviders = [
  provideRouter(routes),
  [ AuthGuard, AuthService ],
  [ ]
//  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
