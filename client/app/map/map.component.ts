import { Component, EventEmitter, OnInit, OnDestroy, Input, Output, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var google: any;

import { MapService } from './map.service';

/**
	What the Maps Component should do:
	1. When I click on the map, a new marker should be added, and brings up a menu to edit its title and description, save it, or remove it. Before saving, clicking on the marker again should remove it.

	2. When I click on an existing marker, the same menu should be displayed.

**/

@Component({
	selector: 'app-maps',
	templateUrl: 'client/app/map/map.component.html',
	styleUrls: ['client/app/map/map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
	private noMapMode = false;

	mapContainer: any;

	@Input() mapObject: any;
	markers : Array<any>;
	selectedLocation: number;

	newLocation: any;
	newMarker: any;

	editMode: boolean;	

	error: any;
	sub: any;
	navigated = false;

	mapId = '57b369cd451959ec28d90056';

	constructor(
		private ngZone: NgZone,
		private mapService: MapService,
		private route: ActivatedRoute) {
		
	}

	/** 
		Lifecycle Methods
	**/

	ngOnInit() {
		// set up the google map container with initial zoom and center coordinatates
		this.ngZone.run(() => {});

		var mapProp = {
			zoom: 4,
			center: {lat: -25.363, lng: 131.044}
		}
		if (!this.noMapMode)
			this.mapContainer = new google.maps.Map(document.getElementById('mapContainer'), mapProp);
			this.addNewMarkerListener();

		this.sub = this.route.params.subscribe(params => {
			if (params['id'] !== undefined) {
				let id = params['id'];
				this.mapService.getMap(id)
				.subscribe((map: any) => {
					this.mapObject = map;
					if (!this.noMapMode)
						this.placeMarkers();
				})
			} else {
				this.navigated = false;
				this.mapObject = this.getMockMap();
				if (!this.noMapMode)
					this.placeMarkers();
			}
		});

	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	/**
		User Input Methods
	**/

	/**
		Methods that deal with adding a new location
	**/
	addNewLocation(lat: number, lng: number) {
		this.newMarker = new google.maps.Marker({
			position: {lat: lat, lng: lng},
			map: this.mapContainer
		});
		var latLng = {lat: lat, lng: lng}
		this.mapContainer.panTo(latLng);
		this.newLocation = latLng;

		this.newMarker.addListener('click', 
			(() => {
				return function(e: any) {
					this.ngZone.run(() => document.getElementById("titleInput").focus());
				}.bind(this);
			})()
		);
	}

	saveNewLocation() {
		this.mapObject.locations.push(this.newLocation);
		this.placeMarker(this.newLocation, this.mapObject.locations.length - 1);
		this.newMarker.setMap(null);
		this.newMarker = null;
		this.newLocation = null;
	}

	cancelNewLocation() {
		if (this.newMarker) {
			this.newMarker.setMap(null);
			this.newMarker = null;
			this.newLocation = null;
		}
	}

	/**
		Methods that deal with existing locations
	**/
	selectLocation(i: number) {
		var location = this.mapObject.locations[i];
		this.selectedLocation = i;
		this.mapContainer.panTo({lat: location.lat, lng: location.lng});

		var infoWindow = new google.maps.InfoWindow();
		infoWindow.setContent(location.title);
		infoWindow.open(this.mapContainer, this.markers[i]);

		console.log(this.selectedLocation);
	}

	editLocation(i: number) {
		this.editMode = true;
		this.selectedLocation = i;
		var location = this.mapObject.locations[i];
		this.mapContainer.panTo({lat: location.lat, lng: location.lng});
	}

	saveLocation(i: number) {
		this.editMode = false;
	}

	cancelEdit() {
		this.editMode = false;
		this.selectedLocation = null;
	}

	removeLocation(i: number) {
		this.mapObject.locations.splice(i, 1);
		this.removeMarker(i);
	}

	/**
		Methods that deal with changing the map object outside of locations
	**/

	saveMap() {
		console.log(this.mapObject);
		// this.mapService.saveMap(this.mapObject)
		// 	.map((ok: any) => {if (ok) console.log('map saved!')});
	}

	/**
		Helpers
	**/

	// gets the map markers on the specified map
	private getMockMap() {
		return {locations: [
			{title: 'Great Barrier Reef', lat: -18.286111, lng: 147.7, description: 'The Great Barrier Reef is the world\'s largest coral reef system[1][2] composed of over 2,900 individual reefs[3] and 900 islands stretching for over 2,300 kilometres (1,400 mi) over an area of approximately 344,400 square kilometres (133,000 sq mi).[4][5] The reef is located in the Coral Sea, off the coast of Queensland, Australia.'},
			{title: 'Uluru (Ayers Rock)', lat: -25.363, lng: 131.044, description: 'Uluru /ˌuːləˈruː/ (Pitjantjatjara: Uluṟu), also known as Ayers Rock /ˌɛərz ˈrɒk/ and officially gazetted as "Uluru / Ayers Rock",[1] is a large sandstone rock formation in the southern part of the Northern Territory in central Australia. It lies 335 km (208 mi) south west of the nearest large town, Alice Springs, 450 km (280 mi) by road.'}, 
			{title: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, description: 'The Sydney Opera House is a multi-venue performing arts centre in Sydney, Australia, identified as one of the 20th century\'s most distinctive buildings.'}
		]};
	}

	private placeMarkers() {
		this.markers = [];
		var locations = this.mapObject.locations;
		for (var i=0; i<locations.length; i++) {
			this.placeMarker(locations[i], i);			
		}
	}

	// add a marker to the map, each with a listener to select the corresponding location
	private placeMarker(l: any, i: number) : any {
		this.markers[i] = new google.maps.Marker({
			position: {lat: l.lat, lng: l.lng},
			map: this.mapContainer,
			title: l.title
		});

		// in order to retain the binding to each respective marker, we need to use a closure to add listeners		
		this.markers[i].addListener('click', 
			((index: number) => {
				return function(e: any) {
					/**
						ngZone.run() is required: http://stackoverflow.com/questions/34592857/view-is-not-updated-on-change-in-angular2
					**/
					this.ngZone.run(() => this.selectLocation(index));
				}.bind(this);
			})(i)
		);
	}

	private removeMarker(i: number) {
		var rmMarker = this.markers.splice(i, 1)[0];
		rmMarker.setMap(null);
	}

	// when the map is clicked, add a marker
	private addNewMarkerListener() {		
		this.mapContainer.addListener('click', 
			(() => {
				return function(e: any) {
					this.ngZone.run(() => {
						this.cancelNewLocation();
						this.addNewLocation(e.latLng.lat(), e.latLng.lng());
					});
				}.bind(this);
			})()
		);
	}
}