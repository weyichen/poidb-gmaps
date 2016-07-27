import { provideRouter, RouterConfig } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";

import { UsersComponent } from './users.component';

const routes: RouterConfig = [
  {
    path: '',
    redirectTo: 'userss',
    pathMatch: 'full'
  },
  {
    path: 'userss',
    component: UsersComponent
  }
];

export const appRouterProviders = [
  provideRouter(routes),
//  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
