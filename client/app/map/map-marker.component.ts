import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';

import { MapService } from './map.service';


declare var google: any;

@Component({
	selector: 'app-map-marker',
	template: `
		<app-map-infowindow *ngIf="_iWOpen"
			[mapContainer]="mapContainer"
			[marker]="_marker"
			[title]="_title"
			(onClose)="closeIW()">
		</app-map-infowindow>
	`
})
export class MapMarker implements OnInit, OnDestroy {

	private _iWOpen: boolean;

	private _location: any;
	private _title: string;
	private _index: number;
	private _marker: any;

	// input setters are run before ngOnInit()
	@Input()
	set mapContainer(mC: any) {
		this._marker = new google.maps.Marker({
			map: mC
		});
	};

	@Input()
	set location(l: any) {
		this._location = l;
		this._marker.setPosition(l);
	}

	@Input()
	set title(t: string) {
		this._title = t;
		this._marker.set('title', t);
	}

	@Input()
	set index(i: number) {
		this._index = i;
		this._marker.set('label', (i === -1) ? '*' : (i + 1).toString());

		this._marker.addListener('click', 
			((i: number) => {
				return function(e: any) {
					//ngZone.run() is required: http://stackoverflow.com/questions/34592857/view-is-not-updated-on-change-in-angular2
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

	// for debugging
	public getMarker() {
		return this._marker;
	}


	ngOnInit() {
		this._iWOpen = false;
	}


	ngOnDestroy() {
		// remember to remove the marker from the map, since this component is not a visible element, but some JS!
		if (this._marker)
			this._marker.setMap(null);
	}


}