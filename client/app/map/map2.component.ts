import { Component, 
	EventEmitter, Input, Output,
	QueryList, ViewChildren, AfterViewInit,
	OnInit, OnDestroy,
	NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var google: any;

import { MapMarker } from './map-marker.component';
import { MapService } from './map.service';

/**
	What the Maps Component should do:

	1. When I click on the map, a new marker should be added, and brings up a menu to edit its title and description, save it, or remove it. Before saving, clicking on the marker again should remove it.

	2. When I click on an existing marker, the same menu should be displayed.
**/

@Component({
	selector: 'app-maps',
	templateUrl: './map2.component.html',
	styleUrls: ['./map.component.css']
})
export class Map2Component implements OnInit, OnDestroy, AfterViewInit {
	private noMapMode = false;

	@Input() mapObject: any;

	mapContainer: any;

	newLocation: any;
	selectedLocation: number;
	editMode: boolean;

	error: any;
	sub: any;
	navigated = false;

	// mapId = '57b369cd451959ec28d90056';

	/**
		think of the ViewChildren: http://blog.mgechev.com/2016/01/23/angular2-viewchildren-contentchildren-difference-viewproviders/
	**/
	@ViewChildren(MapMarker) markerList: QueryList<MapMarker>;

	constructor(
		private ngZone: NgZone,
		private changeDetectorRef: ChangeDetectorRef,
		private mapService: MapService,
		private route: ActivatedRoute) {
		
	}

	/** 
		Lifecycle Methods
	**/

	ngOnInit() {
		// set up the google map container with initial zoom and center coordinatates
		var mapProp = {
			zoom: 4,
			center: {lat: -25.363, lng: 131.044}
		}
		this.mapContainer = new google.maps.Map(document.getElementById('mapContainer'), mapProp);
		

		this.sub = this.route.params.subscribe(params => {
			if (params['id'] !== undefined) {
				this.navigated = true;
				let id = params['id'];
				this.mapService.getMap(id)
				.subscribe((map: any) => {
					this.mapObject = map;
					this.addNewMarkerListener();
				})
			} else {
				this.navigated = false;
				this.mapObject = this.getMockMap();
				this.addNewMarkerListener();
			}
		});

	}

	ngAfterViewInit() {
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	/**
		Menu Input
	**/
	addNewLocation(lat: number, lng: number) {
		this.resetInterface();
		var latLng = {lat: lat, lng: lng};
		this.mapContainer.panTo(latLng);
		this.newLocation = latLng;
		// TODO: focus to title field immediately
	}

	saveNewLocation() {
		var i = this.mapObject.locations.length;
		this.mapObject.locations.push(this.newLocation);
		this.resetInterface();
		this.markerList.toArray()[i].openIW();
	}

	cancelNewLocation() {
		this.resetInterface();
	}

	selectLocation(i: number) {
		this.resetInterface();
		var l = this.mapObject.locations[i];
		this.selectedLocation = i;
		this.mapContainer.panTo({lat: l.lat, lng: l.lng});
		this.markerList.toArray()[i].openIW();
	}

	editLocation(i: number) {
		this.selectLocation(i);
		this.editMode = true;
	}

	saveLocation(i: number) {
		this.resetInterface();
		this.selectedLocation = i;
		this.markerList.toArray()[i].closeIW();
		/*
			trigger change detection manually so child component lifecycle can occur before the boolean is changed back
			http://stackoverflow.com/questions/34827334/triggering-angular2-change-detection-manually
		*/
		this.changeDetectorRef.detectChanges();
		this.markerList.toArray()[i].openIW();
		console.log(this.markerList.toArray()[i].getMarker());
	}

	cancelEdit() {
		this.resetInterface();
	}

	removeLocation(i: number) {
		this.resetInterface();
		this.markerList.toArray()[i].closeIW();
		this.mapObject.locations.splice(i, 1);
	}

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
		Map Input
	**/
	// when a new marker is clicked, pan to its location and focus on its title input field
	newMarkerClicked() {
		var nL = this.newLocation;
		this.mapContainer.panTo({lat: nL.lat, lng: nL.lng});	
		document.getElementById("titleInput").focus();
	}

	markerClicked(i: number) {
		this.selectLocation(i);
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