import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login.component';

import { AuthGuard, AuthService, NavService } from './shared/index';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
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
