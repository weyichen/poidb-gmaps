import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { User } from '../shared/index';

@Injectable()
export class AuthService {
  private apiBase = 'api/auth/';

  constructor(
    private http: Http
  ) { }

  redirectUrl: string;

  login(user: Object): Promise<Object> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiBase + 'login', JSON.stringify(user), {headers: headers})
      .toPromise()
      .then(response => this.handleAuthResponse(response))
      .catch(this.handleError);
  }

  signup(user: Object): Promise<Object> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiBase + 'signup', JSON.stringify(user), {headers: headers})
      .toPromise()
      .then(response => this.handleAuthResponse(response))
      .catch(this.handleError);
  }

  getLoggedInUser(): Promise<Object> {
    return this.http.get(this.apiBase + 'loggedinuser')
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  getLoggedInUserObservable(): Observable<Object> {
    return this.http.get(this.apiBase + 'loggedinuser')
      .map((res) => res.json())
      //.catch(this.handleObservableError);
      // .toPromise()
      // .then(response => response.json())
      // .catch(this.handleError);
  }

  logout(): Promise<void> {
    return this.http.get(this.apiBase + 'logout')
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleAuthResponse(response: any) {
    console.log(response);
    return response.json();
  }

  private handleObservableError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
