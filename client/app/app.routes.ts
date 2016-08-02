import { provideRouter, RouterConfig } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

import { UsersComponent } from './users/users.component';
import { UserProfileComponent } from './users/user-profile.component';
import { LoginComponent } from './auth/login.component';

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
//  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
