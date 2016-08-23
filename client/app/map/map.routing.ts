import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map.component';
import { Map2Component } from './map2.component';

import { AuthGuard, AuthService, NavService } from '../shared/index';

const routes: Routes = [
	{
		path: 'maps/:id',
		component: MapComponent
	},
	{
		path: 'maps',
		component: MapComponent
	},
	{
		path: 'maps2',
		component: Map2Component
	},
	{
		path: 'maps2/:id',
		component: Map2Component
	},
];

export const mapRouting = RouterModule.forChild(routes);