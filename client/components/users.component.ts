import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//import { User } from '../user';
// import { HeroDetailComponent } from './hero-detail.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'my-users',
  templateUrl: 'client/components/users.component.html',
  // styleUrls: ['client/app/users.component.css'],
  // directives: [HeroDetailComponent]
})
export class UsersComponent implements OnInit {
  users: Object[];
  // addingHero: boolean;
  selectedUser: Object;
  error: any;

  constructor(
    private userService: UserService,
    private router: Router) {
    };

    getUsers() {
      this.userService.getUsers()
      .then(users => {
        this.users = users;
        // for (var u in users) {
        //   console.log(users[u]);
        //   this.users.push(new User(users[u]._id, users[u].username, users[u].email));
        // }
      })
    }

    getUser(id: string) {
      this.userService.getUser(id)
      .then(user => this.selectedUser = user);
    }



  // addHero() {
  //   this.addingHero = true;
  //   this.selectedHero = null;
  // }
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
    this.getUser('5779388944f73c5d33cd5fa7');
  }

  onSelect(user: Object) { this.selectedUser = user; }

  // gotoDetail() {
  //   this.router.navigate(['/detail', this.selectedHero.id]);
  // }
}
