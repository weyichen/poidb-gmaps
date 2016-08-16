import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map.component';

import { AuthGuard, AuthService, NavService } from '../shared/index';

const routes: Routes = [
	{
		path: 'maps',
		component: MapComponent
	}
];

export const mapRouting = RouterModule.forChild(routes);