import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';

import { MapService } from './map.service';


declare var google: any;

@Component({
  selector: 'app-map-marker',
  template: `
    <app-map-infowindow *ngIf="_iWOpen"
      [mapContainer]="googleMap"
      [marker]="_marker"
      [title]="_title"
      (onClose)="closeIW()">
    </app-map-infowindow>
  `
})
export class MapMarker implements OnInit, OnDestroy {

  private _location: any;
  private _index: number;
  private _marker: any;

  // input setters are run before ngOnInit()
  @Input()
  set googleMap(mC: any) {
    this._marker = new google.maps.Marker({ map: mC });
    this._marker.setLabel(' ');
  }

  @Input()
  set location(l: any) {
    this._marker.setPosition(l);
    this._location = l;
  }

  @Input()
  set title(t: string) {
    this._marker.set('title', t);
  }

  @Input()
  set index(i: number) {
    this._index = i;
    this.setListeners();
  }

  @Input()
  set selected(s: boolean) {
    this._marker.setDraggable(s);
  }

  @Output() onClick = new EventEmitter<any>();
  @Output() onDrag = new EventEmitter<any>();

  constructor(
    private ngZone: NgZone
  ) {
    
  }

  ngOnInit() {
    this.setListeners();
  }

  ngOnDestroy() {
    // remember to remove the marker from the map, since this component is not a visible element, but some JS!
    if (this._marker)
      this._marker.setMap(null);
  }

  private setListeners() {
    // this._marker.addListener('mouseup', ((marker: any) => {
    //   return (e: any) => {
    //     //ngZone.run() is required: http://stackoverflow.com/questions/34592857/view-is-not-updated-on-change-in-angular2
    //     this.ngZone.run(() => this.onClick.emit(marker));
    //   };
    // })(markerObject));

    this._marker.addListener('mouseup', () => {
      //ngZone.run() is required: http://stackoverflow.com/questions/34592857/view-is-not-updated-on-change-in-angular2
      this.ngZone.run(() => this.onClick.emit(this._index));
    });

    this._marker.addListener('dragend', (e) => {
      this.ngZone.run(() => this.onDrag.emit(e.latLng))
    });
  }


}