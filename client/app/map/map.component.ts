import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
declare var google: any;

import { MapService } from './map.service';

/**
	What the Maps Component should do:
	1. When I click on the map, a new marker should be added, and brings up a menu to edit its title and description, save it, or remove it. Before saving, clicking on the marker again should remove it.

	2. When I click on an existing marker, the same menu should be displayed.

**/

@Component({
	selector: 'app-maps',
	templateUrl: 'client/app/map/map.component.html'
})
export class MapComponent implements OnInit {
	@Output() mapEvents = new EventEmitter();

	@Input() mapObject: Object;

	mapId: string;
	map: any;
	mapMarkers: [any];

	constructor(private mapsService: MapService) {
		
	}

	ngOnInit() {
		// set up the map with initial zoom and center coordinatates
		var mapProp = {
			zoom: 4,
			center: {lat: -25.363, lng: 131.044}
		}

		this.map = this.mapsService.testReturnGoogleMaps();//new google.maps.Map(document.getElementById('googleMap'), mapProp);

		this.mapId = '57b369cd451959ec28d90056';
		this.getMap();

	}

	// gets the map markers on the specified map
	getMockMarkers() {
		this.mapMarkers = [{title: 'Uluru (Ayers Rock)', lat: -25.363, lng: 131.044}, {title: 'Sydney Opera House', lat: -33.8568, lng: 151.2153}];
	}

	getMap()  {
		this.mapsService.getMap(this.mapId)
			.subscribe((map: any) => {
				console.log('response getMap');
				this.mapMarkers = map.locations;
				this.placeMarkersAndWindows();
			})
	}

	saveMap() {
		this.mapsService.saveMap(this.mapObject)
			.map((ok: any) => {if (ok) console.log('map saved!')});
	}

	// add map markers to the map and attach info windows to each
	placeMarkersAndWindows() {
		var marker: any;
		var infoWindow = new google.maps.InfoWindow();
		for (var i=0; i<this.mapMarkers.length; i++) {
			var r = this.mapMarkers[i];

			marker = new google.maps.Marker({
				position: {lat: r.lat, lng: r.lng},
				map: this.map,
				title: r.title
			});
			marker.appData = r;

			// attach info windows to each marker
			infoWindow = new google.maps.InfoWindow({
				content: r.title
			});

			/**
				in order to retain the binding to each respective marker, we need to use a closure to add listeners using this static method
			**/
			google.maps.event.addListener(marker, 'click', (function(marker: any, r: any) {
				return function() {
					console.log(marker.appData.title);
					infoWindow.setContent(r.title);
					infoWindow.open(this.map, marker);
				}
			})(marker, r));
		}

		var theMap = this.map;
		theMap.addListener('click', function(e: any) {
			var marker = new google.maps.Marker({
				position: e.latLng,
				map: theMap
			});
			theMap.panTo(e.latLng);
		});

	}
}