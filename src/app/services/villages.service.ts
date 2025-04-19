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
}
