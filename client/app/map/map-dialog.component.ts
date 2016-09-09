import { Component, 
  OnInit, OnDestroy,
  Input, Output,
  HostBinding,
  EventEmitter, 
  NgZone } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialog implements OnInit, OnDestroy {

  @Input() location: any;

  @Input() 
  set mapPosition(mP: any) {
    // it's NO GOOD to put 10 decimal places in CSS
    this.left = Math.round(mP.x) + 'px';
    this.top = Math.round(mP.y) + 'px';
    // which one is faster? left-top or transform? TBD
    //this.transform = "translate(" + offsetX + "px, " + offsetY + "px)"
  }

  @HostBinding('style.display') display;
  @HostBinding('style.left') left;
  @HostBinding('style.top') top;

  @Output() onClose = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  editMode: boolean;

  constructor(
    private ngZone: NgZone
  ) {
    
  }

  ngOnInit() {  
  }

  ngOnDestroy() {
    
  }

  edit() {
    this.editMode = true;
  }

  cancel() {
    this.editMode = false;
  }

  close() {
    this.onClose.emit();
  }

  delete() {
    this.onDelete.emit();
  }

  save() {
    this.editMode = false;
    this.onSave.emit({title: this.location.title, description: this.location.description});
  }

  
}