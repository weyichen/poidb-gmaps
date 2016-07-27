"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var user_1 = require('./user');
// import { HeroDetailComponent } from './hero-detail.component';
var user_service_1 = require('./user.service');
var UsersComponent = (function () {
    function UsersComponent(userService, router) {
        this.userService = userService;
        this.router = router;
        this.users = [new user_1.User('1', 'tj', 'tj@tj.com')];
    }
    ;
    UsersComponent.prototype.getUsers = function () {
        var _this = this;
        this.userService.getUsers()
            .then(function (users) {
            _this.users = [];
            for (var u in users) {
                _this.users.push(new user_1.User(users[u].id, users[u].username, users[u].email));
            }
            //this.heroes = heroes;
        });
    };
    UsersComponent.prototype.getUser = function (id) {
        var _this = this;
        this.userService.getUser(id)
            .then(function (user) { return _this.selectedUser = user; });
    };
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
    UsersComponent.prototype.ngOnInit = function () {
        this.getUsers();
        this.getUser('5779388944f73c5d33cd5fa7');
    };
    UsersComponent = __decorate([
        core_1.Component({
            selector: 'my-users',
            templateUrl: 'client/app/users.component.html',
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, router_1.Router])
    ], UsersComponent);
    return UsersComponent;
}());
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map