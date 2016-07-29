import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
  selector: 'my-app',
  templateUrl: 'client/components/app.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [UserService]
})
export class AppComponent {
  title: 'My First Angular 2 + Express App!';
}
