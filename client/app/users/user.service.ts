import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';

@Injectable()
export class UserService {
  private usersUrl = 'api/user/list';
  private userUrl = 'api/user/'

  constructor(private http: Http) { }

  list(): Promise<Object[]> {
    return this.http.get(this.usersUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  get(id: string) {
    return this.http.get(this.userUrl + id)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  put(user: any): Promise<Object> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let url = this.userUrl + user._id;

    return this.http.put(url, JSON.stringify(user), {headers: headers})
      .toPromise()
      .then(() => user)
      .catch(this.handleError);
  }

  delete(id: string) {
    return this.http.delete(this.userUrl + id)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
