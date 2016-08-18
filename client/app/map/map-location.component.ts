import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-map-location',
	templateUrl: 'client/app/map/map-location.html'
})
export class MapLocationComponent {

	constructor() {}

	@Input() location: any;

	
}