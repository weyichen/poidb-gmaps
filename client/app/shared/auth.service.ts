import { Injectable, Inject, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/publishLast';

import { User, NavService } from '../shared/index';

@Injectable()
export class AuthService {
  private apiBase = 'api/auth/';

  private _loggedInUser: Observable<any> = null;

  redirectUrl: string;

  constructor(
    private router: Router,
    private http: Http,
    /**
      Super duper solution - forward refs: http://stackoverflow.com/questions/35117029/injecting-services-into-services-in-angular2
      http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html
    **/
    private navService: NavService
  ) {
  }

  
  login(user: Object): Promise<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiBase + 'login', JSON.stringify(user), {headers: headers})
    .toPromise()
    .then(response => this.handleLoginResponse(response))
    .catch(this.handleError);
  }


  signup(user: Object): Promise<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiBase + 'signup', JSON.stringify(user), {headers: headers})
    .toPromise()
    .then(response => this.handleLoginResponse(response))
    .catch(this.handleError);
  }


  getLoggedInUser(): Observable<any> {
    if (!this._loggedInUser) {
      this._loggedInUser = this.http.get(this.apiBase + 'logged-in-user')
      .map((res) => res.json())
      .publishLast() // caching: http://www.syntaxsuccess.com/viewarticle/caching-with-rxjs-observables-in-angular-2.0
      .refCount()
      .catch(this.handleObservableError);
    }

    return this._loggedInUser; 
  }


  logout(): Promise<any> {
    return this.http.get(this.apiBase + 'logout')
    .toPromise()
    .then(response => {
      if (response.ok) {
        this._loggedInUser = null;
        this.navService.changeMessage('Successfully logged out. See you next time!');
      } else {
        this.navService.changeMessage('Error logging out!');
      }
      return response;
    })
    .catch(this.handleError);
  }


  private handleLoginResponse = (response: any) => {
    response = response.json();
      if (response.ok) {
        this._loggedInUser = null;
        this.navService.logIn(response.data);
        this.navService.queueMessage('Welcome, ' + response.data.username);
        this.router.navigateByUrl('/');
      } else {
        this.navService.changeMessage(response.error);
      }
  }


  private handleObservableError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg);
    return Observable.throw(errMsg);
  }


  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
