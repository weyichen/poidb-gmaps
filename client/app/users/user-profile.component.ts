import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService, AuthService, NavService } from '../shared/index';

@Component({
  selector: 'user-profile',
  templateUrl: 'client/app/users/user-profile.component.html',
  styles: []
})

export class UserProfileComponent implements OnInit, OnDestroy {
  @Input() user: Object;
  @Output() close = new EventEmitter();

  editing = false;

  error: any;
  sub: any;
  navigated = false;

  constructor(
    private userService: UserService,
    private navService: NavService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.navigated = true;
        this.userService.get(id)
          .then(user => {
            if (user) {
              this.user = user;
              this.navService.changeTitle('Editing user ' + user.username);
            }
          })
          .catch((error) => console.error(error));
      } else {
        this.navigated = false;
        this.user = null;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editToggle() {
    if (!this.editing)
      this.editing = true;
    else
      this.editing = false;
  }

  save() {
    // this.userService
    //   .put(this.user)
    //   .then(user => {
    //     this.user = user;
    //   })
    //   .catch(error => this.error = error);
  }

  // goBack(savedHero: Hero = null) {
  //   this.close.emit(savedHero);
  //   if (this.navigated)
  //     window.history.back();
  // }
}
