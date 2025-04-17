import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../../constant';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor( private httpclient:HttpClient ) { }

  // filterEvents(categoryId: string, locationId: string, page: number = 1): Observable<any> {
  //   return this.httpclient.get(`${URL}locationByEvents/`, {
  //     params: {
  //       category: categoryId,
  //       input_value: locationId,
  //       page: page.toString()
  //     }
  //   });
  // }

  GetallinactiveEvents():Observable<any>{
    return this.httpclient.get(URL+"events_inactive")
  }
 
  Editbyeventresponse(_id:string):Observable<any>{
    return this.httpclient.get(URL+"event/"+ _id)
  }
}
