import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';

@Injectable()
export class UserService {
  private apiBase = 'api/user/';

  constructor(private http: Http) { }

  list(): Promise<Object[]> {
    return this.http.get(this.apiBase + 'list')
      .toPromise()
      .then(response => response.json().users)
      .catch(this.handleError);
  }

  get(id: string) {
    return this.http.get(this.apiBase + id)
    .toPromise()
    .then(response => response.json().user)
    .catch(this.handleError);
  }

  put(form: any, id: string): Promise<Object> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let url = this.apiBase + id;

    return this.http.put(url, JSON.stringify(form), {headers: headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  delete(id: string) {
    return this.http.delete(this.apiBase + id)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
