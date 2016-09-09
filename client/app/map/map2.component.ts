import { Component, 
  EventEmitter, Input, Output,
  QueryList, ViewChild, ViewChildren, AfterViewInit, ElementRef,
  OnInit, OnDestroy,
  NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

declare var google: any;

import { MapMarker } from './map-marker.component';
import { MapDialog } from './map-dialog.component';

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
  mapObservable: Observable<any>;
  mapObject: any; // state store

  // http://stackoverflow.com/a/38148222
  @ViewChild('mapContainer') mapContainer: ElementRef;

  googleMap: any;
  overlay: any;

  selectedLocation: number = null;
  dialogPosition: any;

  sub: any;

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
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.mapObservable = this.mapService.getMap(id);
      } else {
        this.mapObservable = this.mapService.getMockMap();
      }
    });
  }

  // initialize the map after DOM elements are accessible by the component
  ngAfterViewInit() {
    this.googleMap = new google.maps.Map(this.mapContainer.nativeElement);
    this.overlay = new google.maps.OverlayView();
    this.overlay.draw = function() {};
    this.overlay.setMap(this.googleMap);

    this.mapObservable.subscribe((map: any) => {
      this.mapObject = map;
      this.setUpMap();
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /**
    User Input
  **/
  addNewLocation(lat: number, lng: number) {
    var nLocations = this.mapObject.locations.length;
    var newLocation = {title: "Point " + (nLocations + 1), lat: lat, lng: lng};
    this.mapObject.locations.push(newLocation);
    this.selectedLocation = this.mapObject.locations.length - 1;
    this.googleMap.panTo({lat: lat, lng: lng});
    // TODO: focus to title field immediately
  }

  selectLocation(i: number) {
    var l = this.mapObject.locations[i];
    this.selectedLocation = i;
    this.googleMap.panTo({lat: l.lat, lng: l.lng});
    this.drawDialogBox();
  }

  removeLocation(i: number) {
    this.mapObject.locations.splice(i, 1);
  }

  saveMap() {
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
  markerClicked(i: number) {
    this.selectLocation(i);
  }

  markerDragged(location: any) {
    var p = location;
    var location = this.mapObject.locations[this.selectedLocation];
    Object.assign(location, {lat: p.lat(), lng: p.lng()});
    this.drawDialogBox();
  }

  dialogClosed() {
    this.selectedLocation = null;
  }

  dialogDeleted() {
    this.mapObject.locations.splice(this.selectedLocation, 1);
    this.selectedLocation = null;
  }

  dialogSaved(titleAndDescription: any) {
    var location = this.mapObject.locations[this.selectedLocation];
    Object.assign(location, titleAndDescription);
  }


  /**
    Helpers
  **/
  private setUpMap() {
    this.setMapBounds();
    this.addNewMarkerListener();
    this.testListener();
  }

  private setMapBounds() {
    // https://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
    var bounds = new google.maps.LatLngBounds();
    var locations = this.mapObject.locations;
    for (var i=0; i<locations.length; i++) {
      bounds.extend(new google.maps.LatLng(locations[i].lat, locations[i].lng));
    }
    this.googleMap.fitBounds(bounds);
  }

  // when the map is clicked, add a marker
  private addNewMarkerListener() {
    this.googleMap.addListener('click', (e) => {
      this.ngZone.run(() => {
        this.addNewLocation(e.latLng.lat(), e.latLng.lng());
      });
    });
  }

  private testListener() {
    this.googleMap.addListener('bounds_changed', () => {
      this.ngZone.run(() => {
        this.drawDialogBox();
      })
    })
  }

  private drawDialogBox() {
    if (!Number.isInteger(this.selectedLocation))
      return;

    // http://stackoverflow.com/questions/1538681/how-to-call-fromlatlngtodivpixel-in-google-maps-api-v3
    let l = this.mapObject.locations[this.selectedLocation];
    let latLng = new google.maps.LatLng({ lat: l.lat, lng: l.lng });
    this.dialogPosition = this.overlay.getProjection().fromLatLngToContainerPixel(latLng);
  }

}