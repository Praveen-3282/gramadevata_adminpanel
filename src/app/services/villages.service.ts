import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../../constant';

@Injectable({
  providedIn: 'root'
})
export class VillagesService {

  constructor(private httpclient:HttpClient) { }


    GetallinactiveVillages():Observable<any>{
      return this.httpclient.get(URL+"village_inactive")
    }

    // getvillage(_id:string):Observable<any>{
    //   console.log('getvillages')
    //   return this.httpclient.get(URL+"village_inactive_get/_id/"+ _id)
    // }

    getvillage(_id: string): Observable<any> {
      console.log('getvillages')
      return this.httpclient.get(URL + "village_inactive_get/_id/" + _id)
    }
    
    updateTempleDetails(templeId: string, templeData: any): Observable<any> {
      const updateUrl = `${URL}village/${templeId}`;  
      return this.httpclient.put(updateUrl, templeData);
    }
}
