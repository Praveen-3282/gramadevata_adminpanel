import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor( private httpclient:HttpClient ) { }

  filterEvents(categoryId: string, locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}locationByEvents/`, {
      params: {
        category: categoryId,
        input_value: locationId,
        page: page.toString()
      }
    });
  }


  GetallEvents():Observable<any>{
    return this.httpclient.get(URL+"event")
  }
}
