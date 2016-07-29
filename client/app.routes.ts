import { provideRouter, RouterConfig } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

import { UsersComponent } from './components/users.component';
import { UserProfileComponent } from './components/user-profile.component';
import { UserLoginComponent } from './components/user-login.component';

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
    component: UserLoginComponent
  }
];

export const appRouterProviders = [
  provideRouter(routes),
//  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
