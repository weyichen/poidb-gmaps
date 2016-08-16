import { NgModule } from '@angular/core';

import { MapComponent } from './map.component';

import { SharedModule } from '../shared/shared.module';

import { mapRouting } from './map.routing';

import { MapService } from './map.service';

@NgModule({
	declarations: [
		MapComponent
	],
	imports: [
		SharedModule,
		mapRouting
	],
	providers: [
		MapService
	]
})
export class MapModule {}