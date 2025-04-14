import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../../constant';

@Injectable({
  providedIn: 'root'
})
export class GoshalaService {

  constructor(private httpclient: HttpClient) { }

  getallgoshalas():Observable<any>{
      return this.httpclient.get(URL+"goshala_inactive")
    }


    // GetallGoshala():Observable<any>{
    //   return this.httpclient.get(URL+"goshala")
    // }

    filterGoshalas(categoryId: string, locationId: string, page: number = 1): Observable<any> {
      return this.httpclient.get(`${URL}locationByGoshalas/`, {
        params: {
          category: categoryId,
          input_value: locationId,
          page: page.toString()
        }
      });
    }

    
  getGoshalaCatgeories():Observable<any>{
    return this.httpclient.get(URL+"goshalacategories")
  }


  getbyGoshala(_id:string):Observable<any>{
    return this.httpclient.get(URL+'goshala?_id='+_id)
  }


  Editbygoshalagetresponse(_id:string):Observable<any>{
    return this.httpclient.get(URL+"goshala/"+ _id)
  }

  
}
