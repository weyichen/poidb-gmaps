import { Injectable, Inject, forwardRef } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';
import { NavService } from './nav.service';

@Injectable()
export class UserService {
  private apiBase = 'api/user/';

  constructor(
    private http: Http,
    private navService: NavService
  ) { }

  list(): Promise<any> {
    return this.http.get(this.apiBase + 'list')
    .toPromise()
    .then(this.handleResponse)
    .catch(this.handleError);
  }

  get(id: string): Promise<any> {
    return this.http.get(this.apiBase + id)
    .toPromise()
    .then(this.handleResponse)
    .catch(this.handleError);
  }

  put(form: any, id: string): Promise<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let url = this.apiBase + id;

    return this.http.put(url, JSON.stringify(form), {headers: headers})
    .toPromise()
    .then((response: any) => {
      var msg = response.ok ? "Saved changes successfully." : "Error saving your changes: " + response.error;
      this.navService.changeMessage(msg);
    })
    .catch(this.handleError);
  }

  delete(id: string) {
    return this.http.delete(this.apiBase + id)
    .toPromise()
    .then((response: any) => {
      var msg = response.ok ? "User was deleted." : "Error deleting user: " + response.error;
      this.navService.changeMessage(msg);
    })
    .catch(this.handleError);
  }

  private handleResponse = (response: any) => {
    response = response.json();
      if (response.ok){
        return response.data;
      }
      else {
        return Promise.reject(response.error);
      }
  }

  private handleError = (error: any) => {
    this.navService.changeMessage(error);
  }

}
