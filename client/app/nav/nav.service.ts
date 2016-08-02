import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavService {

  constructor() { }

  private titleChangedSource = new Subject<string>();

  titleChanged$ = this.titleChangedSource.asObservable();

  title: string;

  changeTitle(title: string) {
    this.titleChangedSource.next(title);
  }

  getTitle() {
    return this.title;
  }
}
