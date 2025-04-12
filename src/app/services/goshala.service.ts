import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoshalaService {

  constructor(private httpclient: HttpClient) { }

  getallgoshalas():Observable<any>{
      return this.httpclient.get(URL+"goshala_inactive")
    }
}
