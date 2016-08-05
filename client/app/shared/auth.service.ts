import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../shared/index';

@Injectable()
export class AuthService {
  private apiBase = 'api/auth/';

  constructor(
    private http: Http
  ) { }

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

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
