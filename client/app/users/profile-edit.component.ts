import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService, AuthService, NavService } from '../shared/index';

@Component({
  selector: 'profile-edit',
  templateUrl: './profile-edit.component.html',
  styles: []
})

export class ProfileEditComponent implements OnInit {
  @Input() user: any;

  // admin can include an id parameter and edit any user
  adminMode = false;

  error: any;
  sub: any;

  constructor(
    private userService: UserService,
    private navService: NavService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        this.adminMode = true;
        let id = params['id'];
        this.userService.get(id)
        .then(user => {
          if (user) {
            this.user = user;
            this.navService.changeTitle('Editing user ' + user.username);
          }
        });
      } else {
        this.adminMode = false;
        /**
          Very Strange Problem: If I create an Observable to an url in CanActivate, it prevents all further subscriptions to the same url in the activated route from receiving stuff. Subscribing to any other url works fine. Caching fixes the problem.
        **/
        this.authService.getLoggedInUser()
        .subscribe((user: any) => {
          this.user = user.data;
          this.navService.changeTitle('Editing your profile');  
        },
        (error: any) => {
          this.error = error;
        })
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save(form: any) {
    this.userService
      .put(form, this.user._id)
      .catch(error => this.error = error);
  }
}
