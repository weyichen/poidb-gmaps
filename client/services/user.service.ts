import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../user';

@Injectable()
export class UserService {
  private usersUrl = 'users';
  private userUrl = 'user/'

  constructor(private http: Http) { }

  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getUser(id: string) {
    return this.http.get(this.userUrl + id)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }



  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
