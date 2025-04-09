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
}
