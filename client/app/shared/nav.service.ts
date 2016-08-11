import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavService {

  constructor(
  ) { }

  private titleChangedSource = new Subject<string>();
  private messageChangedSource = new Subject<string>();
  private loggedInSource = new Subject<Object>();

  titleChanged$ = this.titleChangedSource.asObservable();
  messageChanged$ = this.messageChangedSource.asObservable();
  loggedIn$ = this.loggedInSource.asObservable();

  changeTitle(title: string) {
    this.titleChangedSource.next(title);
  }

  changeMessage(message: string) {
    this.messageChangedSource.next(message);
  }

  logIn(user: Object) {
    this.loggedInSource.next(user);
  }

}
