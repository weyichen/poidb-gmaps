import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

declare var google: any;

@Injectable()
export class MapService {
	private apiBase = 'api/map/';

	constructor(private http: Http) {

	}

	// create a new map belonging to the logged in user
	newMap(map: any) : Observable<boolean> {
		let headers = new Headers({
			'Content-Type': 'application/json'
		});
		let url = this.apiBase + 'new';

		return this.http.post(url, JSON.stringify(map), {headers: headers})
			.map((res: any) => res.json().ok)
	}

	getMap(id: string) : Observable<Object[]> {
		console.log(this.apiBase + id);
		return this.http.get(this.apiBase + id)
			.map((res: any) => res.json().map)
			.catch(this.handleObservableError);
	}

	// we will only edit the markers when we save the map, so there is no need for a separate set of CRUD methods for markers
	saveMap(map: any) : Observable<boolean> {
		let headers = new Headers({
			'Content-Type': 'application/json'
		});
		let url = this.apiBase + map._id;

		return this.http.put(url, JSON.stringify(map), {headers: headers})
			.map((res: any) => res.json())
	}

	deleteMap(id: string) : Observable<boolean> {
		return this.http.delete(this.apiBase + id)
			.map((res: any) => res.json().ok)
	}

	private handleObservableError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}