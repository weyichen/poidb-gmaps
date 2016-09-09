import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';

import { MapService } from './map.service';


declare var google: any;

@Component({
	selector: 'app-map-infowindow',
	template: ''
})
export class MapInfowindow implements OnInit, OnDestroy {

	infoWindow: any;

	@Input() mapContainer: any;
	@Input() marker: any;

	@Input()
	set title(t: any) {
		if (this.infoWindow) {
			this.infoWindow.close();
		}
		var iW = new google.maps.InfoWindow();
		iW.setContent(t);
		iW.addListener('closeclick', 
			(() => {
				return function(e: any) {
					this.ngZone.run(() => this.onClose.emit());
				}.bind(this);
			})()
		);

		iW.open(this.mapContainer, this.marker)
		this.infoWindow = iW;
	}


	@Output() onClose = new EventEmitter<void>();

	constructor(
		private ngZone: NgZone
	) {
		
	}

	ngOnInit() {
		
	}

	ngOnDestroy() {
		this.infoWindow.close();
	}

}