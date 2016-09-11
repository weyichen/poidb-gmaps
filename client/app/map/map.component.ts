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

import { NavService } from '../shared';
import { MapService } from './map.service';

/*
  Map Features
  1. // TODO
*/

@Component({
  selector: 'app-maps',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  sub: any;
  mapObservable: Observable<any>;
  mapObject: any; // state store

  /* 
    avoid direct DOM manipluation, use a ViewChild selector to access an elementById
    http://stackoverflow.com/a/38148222
  */
  @ViewChild('mapContainer') mapContainer: ElementRef;

  googleMap: any;
  overlay: any;

  selectedLocation: number = null;
  dialogPosition: any;

  addLocationListener: any;

  /*
    think of the ViewChildren: http://blog.mgechev.com/2016/01/23/angular2-viewchildren-contentchildren-difference-viewproviders/
  */
  @ViewChildren(MapMarker) markerList: QueryList<MapMarker>;

  constructor(
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,

    private navService: NavService,
    private mapService: MapService,
    private route: ActivatedRoute) {
    
  }

  /*
    Lifecycle Methods
  */
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

  /*
    User Input
  */
  addMode() {
    this.addLocationListener = this.googleMap.addListener('click', (e) => {
      this.ngZone.run(() => {
        this.addNewLocation(e.latLng.lat(), e.latLng.lng());
      });
    });
  }

  panMode() {
    google.maps.event.removeListener(this.addLocationListener);
  }

  addNewLocation(lat: number, lng: number) {
    var nLocations = this.mapObject.locations.length;
    var newLocation = {title: "Point " + (nLocations + 1), lat: lat, lng: lng};
    this.mapObject.locations.push(newLocation);
    this.googleMap.panTo({lat: lat, lng: lng});
    this.selectedLocation = this.mapObject.locations.length - 1;
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
          this.navService.changeMessage('Map saved!');
          this.mapObject.__v++; // simple versioning for now
        }
        else {
          this.navService.changeMessage('Couldn\'t save the map. Check console for errors.');
          console.log(res.err);
        }
      });
  }


  /*
    Map Input
  */
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


  /*
    Helpers
  */
  private setUpMap() {
    this.setMapBounds();
    this.boundsListener();
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

  private boundsListener() {
    this.googleMap.addListener('bounds_changed', () => {
      this.ngZone.run(() => {
        this.drawDialogBox();
      })
    })
  }

  /* 
    http://stackoverflow.com/questions/1538681/how-to-call-fromlatlngtodivpixel-in-google-maps-api-v3
    get the position of the selected marker and place the dialog box there
  */
  private drawDialogBox() {
    if (!Number.isInteger(this.selectedLocation))
      return;
    let l = this.mapObject.locations[this.selectedLocation];
    let latLng = new google.maps.LatLng({ lat: l.lat, lng: l.lng });
    this.dialogPosition = this.overlay.getProjection().fromLatLngToContainerPixel(latLng);
  }

}