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
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
	private noMapMode = false;

	@Input() mapObject: any;

	mapContainer: any;
	markers: Array<any>;
	infoWindows: Array<any>;
	newMarker: any;

	newLocation: any;
	selectedLocation: number;
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
						this.placeMarkersAndInfoWindows();
				})
			} else {
				this.navigated = false;
				this.mapObject = this.getMockMap();
				if (!this.noMapMode)
					this.placeMarkersAndInfoWindows();
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

	/** ADD NEW LOCATION
		reset interface
			close edit marker dialog
			close new marker dialog
			close selected marker dialog
			remove new marker
		open new marker dialog
		focus to title field - NOT IMPLEMENTED
		add marker at location clicked
		pan to location clicked
	**/
	addNewLocation(lat: number, lng: number) {
		this.resetInterface();

		this.newMarker = new google.maps.Marker({
			position: {lat: lat, lng: lng},
			label: '*',
			map: this.mapContainer
		});
		var latLng = {lat: lat, lng: lng};
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

	/**	SAVE NEW LOCATION
		push to mapObject
		place new marker
		open new InfoWindow
		reset interface
	**/
	saveNewLocation() {
		var i = this.mapObject.locations.length;
		this.mapObject.locations.push(this.newLocation);
		this.resetInterface();
		this.placeMarker(i);
		this.placeInfoWindow(i);
		this.openInfoWindow(i);
	}

	/**	SAVE NEW LOCATION
		reset interface
	**/
	cancelNewLocation() {
		this.resetInterface();
	}

	/**
		Methods that deal with existing locations
	**/

	/**	SELECT LOCATION
		reset interface
		select location
		open info dialog
		pan to location
		open info window
	**/
	selectLocation(i: number) {
		this.resetInterface();

		var location = this.mapObject.locations[i];
		this.selectedLocation = i;
		this.mapContainer.panTo({lat: location.lat, lng: location.lng});
		this.openInfoWindow(i);
	}

	/**	EDIT LOCATION
		reset interface
		select location
		open edit dialog
	**/
	editLocation(i: number) {
		this.selectLocation(i);
		this.editMode = true;
	}

	/**	SAVE LOCATION
		reset interface
		push changes to server -- NOT IMPLEMENTED
	**/
	saveLocation(i: number) {
		this.resetInterface();
		this.selectedLocation = i;
		this.closeInfoWindow(i);
		this.placeInfoWindow(i);
		this.openInfoWindow(i);
	}

	cancelEdit() {
		this.resetInterface();
	}

	removeLocation(i: number) {
		this.resetInterface();
		this.closeInfoWindow(i);
		this.removeMarker(i);
		this.mapObject.locations.splice(i, 1);

	}

	/**
		Methods that deal with changing the map object outside of locations
	**/

	saveMap() {
		console.log(this.mapObject);

		this.mapService.saveMap(this.mapObject)
		 	.subscribe((res: any) => {
		 		if (res.ok) {
		 			console.log('map saved!');
		 			this.mapObject.__v++; // simple versioning for now
		 		}
		 		else
		 			console.log(res.err);
		 	});
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

	private resetInterface() {
		this.editMode = false;
		this.selectedLocation = null;
		this.newLocation = null;
		if (this.newMarker) {
			this.newMarker.setMap(null);
			this.newMarker = null;
		}
	}

	private placeMarkersAndInfoWindows() {
		this.markers = [];
		this.infoWindows = [];
		var locations = this.mapObject.locations;
		for (var i=0; i<locations.length; i++) {
			this.placeMarker(i);
			this.placeInfoWindow(i);		
		}
	}

	// add a marker to the map, each with a listener to select the corresponding location
	private placeMarker(i: number) : any {
		var l = this.mapObject.locations[i];
		var marker = new google.maps.Marker({
			position: {lat: l.lat, lng: l.lng},
			label: (i+1).toString(),
			map: this.mapContainer,
			title: l.title
		});

		// in order to retain the binding to each respective marker, we need to use a closure to add listeners		
		marker.addListener('click', 
			((index: number) => {
				return function(e: any) {
					/**
						ngZone.run() is required: http://stackoverflow.com/questions/34592857/view-is-not-updated-on-change-in-angular2
					**/
					this.ngZone.run(() => this.selectLocation(index));
				}.bind(this);
			})(i)
		);
		this.markers[i] = marker;
	}

	private removeMarker(i: number) {
		var rmMarker = this.markers.splice(i, 1)[0];
		rmMarker.setMap(null);
	}

	private placeInfoWindow(i: number) {
		var iW = new google.maps.InfoWindow();
		iW.opened = false;
		iW.setContent(this.mapObject.locations[i].title);
		iW.addListener('closeclick', 
			((index: number) => {
				return function(e: any) {
					this.ngZone.run(() => this.infoWindows[i].opened = false);
				}.bind(this);
			})(i)
		);
		this.infoWindows[i] = iW;
	}

	private openInfoWindow(i: number) {
		var iW = this.infoWindows[i];
		if (!iW.opened) {
			iW.open(this.mapContainer, this.markers[i]);
			iW.opened = true;
		}
	}

	private closeInfoWindow(i: number) {
		var iW = this.infoWindows[i];
		if (iW.opened) {
			iW.close();
			iW.opened = false;
		}
	}

	// when the map is clicked, add a marker
	private addNewMarkerListener() {		
		this.mapContainer.addListener('click', 
			(() => {
				return function(e: any) {
					this.ngZone.run(() => {
						this.addNewLocation(e.latLng.lat(), e.latLng.lng());
					});
				}.bind(this);
			})()
		);
	}
}