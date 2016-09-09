import { NgModule } from '@angular/core';

import { MapComponent } from './map.component';
import { Map2Component } from './map2.component';
import { MapMarker } from './map-marker.component';
import { MapInfowindow } from './map-infowindow.component';
import { MapDialog } from './map-dialog.component';

import { SharedModule } from '../shared/shared.module';

import { mapRouting } from './map.routing';

import { MapService } from './map.service';

@NgModule({
	declarations: [
		MapComponent,
		Map2Component,
		MapMarker,
		MapInfowindow,
		MapDialog
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