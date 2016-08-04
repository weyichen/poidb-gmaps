import { Inject, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/toPromise';

import { User } from '../shared/index';

@Injectable()
export class AuthService {

  constructor(
    private http: Http
  ) { }

  private loggedInSource = new Subject<Object>();

  loggedIn$ = this.loggedInSource.asObservable();

  login(user: Object): Promise<Object> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post('login', JSON.stringify(user), {headers: headers})
      .toPromise()
      .then(response => this.handleAuthResponse(response))
      .catch(this.handleError);
  }

  signup(user: Object): Promise<Object> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post('signup', JSON.stringify(user), {headers: headers})
      .toPromise()
      .then(response => this.handleAuthResponse(response))
      .catch(this.handleError);
  }

  getLoggedInUser(): Object {
    return JSON.parse(window.localStorage.getItem('loggedInUser'));
  }

  logout(): Promise<void> {
    return this.http.get('logout')
      .toPromise()
      .then((response: any) => {
        window.localStorage.removeItem('loggedInUser');
      })
      .catch(this.handleError);
  }

  private handleAuthResponse(response: any) {
    response = response.json();
    if (response._id)
      window.localStorage.setItem('loggedInUser', JSON.stringify(response));
    return response;
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
