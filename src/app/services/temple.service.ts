import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../../constant';

@Injectable({
  providedIn: 'root'
})
export class TempleService {

  constructor(private httpclient: HttpClient) { }

   getalltemples():Observable<any>{
    return this.httpclient.get(URL+"temple")
  }

  getbytemple(_id:string):Observable<any>{
    return this.httpclient.get(URL+"templeget/_id/"+ _id)
  }

  getallcategories(): Observable<any>{
    return this .httpclient.get(URL+ "templeCategeory")
  }

  filterTemple(categoryId:string, locationId: string, page: number = 1): Observable<any>{
    return this.httpclient.get(`${URL}locationByTemples/`,{
      params: {
        category: categoryId,
        input_value: locationId,
        page: page.toString(),
      }
    })
  }
}
