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

  private messageQueue: string[] = [];

  changeTitle(title: string) {
    this.titleChangedSource.next(title);
  }

  changeMessage(message: string) {
    this.messageChangedSource.next(message);
  }

  queueMessage(message: string) {
    this.messageQueue.push(message);
  }

  // return newline-concatenated string of messages in the queue
  getMessages() {
    var mQ = this.messageQueue;
    if (mQ.length < 1)
      return null;

    var messageString = "";
    for (var i=0; i<mQ.length; i++) {
      messageString += mQ[i];
      if (i !== mQ.length -1)
        messageString += "\n";
    }

    this.messageQueue = [];

    return messageString;
  }


  logIn(user: Object) {
    this.loggedInSource.next(user);
  }

}
