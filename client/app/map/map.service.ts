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

  getMockMap(): Observable<Object> {
    return Observable.of(
      {locations: [
        {title: 'Great Barrier Reef', lat: -18.286111, lng: 147.7, description: 'The Great Barrier Reef is the world\'s largest coral reef system[1][2] composed of over 2,900 individual reefs[3] and 900 islands stretching for over 2,300 kilometres (1,400 mi) over an area of approximately 344,400 square kilometres (133,000 sq mi).[4][5] The reef is located in the Coral Sea, off the coast of Queensland, Australia.'},
        {title: 'Uluru (Ayers Rock)', lat: -25.363, lng: 131.044, description: 'Uluru /ˌuːləˈruː/ (Pitjantjatjara: Uluṟu), also known as Ayers Rock /ˌɛərz ˈrɒk/ and officially gazetted as "Uluru / Ayers Rock",[1] is a large sandstone rock formation in the southern part of the Northern Territory in central Australia. It lies 335 km (208 mi) south west of the nearest large town, Alice Springs, 450 km (280 mi) by road.'}, 
        {title: 'Sydney Opera House', lat: -33.8568, lng: 151.2153, description: 'The Sydney Opera House is a multi-venue performing arts centre in Sydney, Australia, identified as one of the 20th century\'s most distinctive buildings.'}
      ]}
      );
  }

  private handleObservableError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}