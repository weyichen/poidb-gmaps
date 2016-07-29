import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

//import { User } from '../user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'my-users',
  templateUrl: 'client/components/users.component.html',
  styles: [`
    .selected {
      background-color: #CFD8DC !important;
      color: white;
    }
    `],
  directives: [ROUTER_DIRECTIVES]
})
export class UsersComponent implements OnInit {
  users: any[];
  selectedUser: any;
  error: any;

  constructor(
    private userService: UserService,
    private router: Router) {
    };

    getUsers() {
      this.userService.list()
      .then(users => this.users = users)
    }

    getUser(id: string) {
      this.userService.get(id)
      .then(user => this.selectedUser = user);
    }

  //
  // close(savedHero: Hero) {
  //   this.addingHero = false;
  //   if (savedHero) {this.getHeroes(); }
  // }
  //
  // deleteHero(hero: Hero, event: any) {
  //   event.stopPropagation();
  //   this.heroService
  //     .delete(hero)
  //     .then(res => {
  //       this.heroes = this.heroes.filter(h => h !== hero);
  //       if (this.selectedHero === hero) { this.selectedHero = null; }
  //     })
  //     .catch(error => this.error = error);
  // }
  //
  ngOnInit() {
    this.getUsers();
    this.userService.getLoggedInUser()
    .then(user => this.selectedUser = user);
  }

  onSelect(user: Object) { this.selectedUser = user; }

  gotoProfile() {
    this.router.navigate(['/user', this.selectedUser._id]);
  }
}
