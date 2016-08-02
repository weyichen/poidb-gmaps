import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../users/user';

@Injectable()
export class AuthService {
  private usersUrl = 'api/user/list';
  private userUrl = 'api/user/'

  constructor(private http: Http) { }

  login(user: Object): Promise<Object> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post('login', JSON.stringify(user), {headers: headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  signup(user: Object): Promise<Object> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post('signup', JSON.stringify(user), {headers: headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getLoggedInUser(): Promise<Object> {
    return this.http.get('loggedinuser')
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
