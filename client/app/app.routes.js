"use strict";
var router_1 = require('@angular/router');
var users_component_1 = require('./users.component');
var routes = [
    {
        path: '',
        redirectTo: 'userss',
        pathMatch: 'full'
    },
    {
        path: 'userss',
        component: users_component_1.UsersComponent
    }
];
exports.appRouterProviders = [
    router_1.provideRouter(routes),
];
//# sourceMappingURL=app.routes.js.map