import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
  selector: 'my-app',
  template: `
  <h1>{{title}}</h1>
  <nav>
    <a [routerLink]="['/userss']" routerLinkActive="active">Users</a>
  </nav>
  <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [UserService]
})
export class AppComponent {
  title: 'My First Angular 2 + Express App!'
}
