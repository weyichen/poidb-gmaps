import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';

import { MapService } from './map.service';


declare var google: any;

@Component({
	selector: 'app-map-marker',
	template: `
		<app-map-infowindow *ngIf="_iWOpen"
			[mapContainer]="mapContainer"
			[marker]="marker"
			[location]="_location"
			(onClose)="closeIW()">
		</app-map-infowindow>
	`
})
export class MapMarker implements OnInit, OnDestroy {

	private _iWOpen: boolean;
	private marker: any;
	private _location: any;

	@Input() mapContainer: any;

	@Input()
	set location(l: any) {
		this._location = l;
	}

	@Input()
	set index(i: number) {

		if (this.marker)
			this.marker.setMap(null);

		var l = this._location;

		this.marker = new google.maps.Marker({
			position: {lat: l.lat, lng: l.lng},
			label: (i === -1) ? '*' : (i + 1).toString(),
			map: this.mapContainer,
			title: l.title
		});


		this.marker.addListener('click', 
			((i: number) => {
				return function(e: any) {
					/**
						ngZone.run() is required: http://stackoverflow.com/questions/34592857/view-is-not-updated-on-change-in-angular2
					**/
					this.ngZone.run(() => this.onClick.emit(i));
				}.bind(this);
			})(i)
		);
	}

	@Output() onClick = new EventEmitter<number>();

	constructor(
		private ngZone: NgZone
	) {
		
	}

	public openIW() {
		this._iWOpen = true;
	}

	public closeIW() {
		this._iWOpen = false;
	}


	ngOnInit() {
		this._iWOpen = false;
	}

	ngOnDestroy() {
		// remember to remove the marker from the map, since this component is not a visible element, but some JS!
		if (this.marker)
			this.marker.setMap(null);
	}


}