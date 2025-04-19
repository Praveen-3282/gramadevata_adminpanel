import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constant';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpclient:HttpClient) { }

  GetAllCountries():Observable<any>{
    return this.httpclient.get(URL+"country")
  }

  getAllStates():Observable<any>{
    return this.httpclient.get(URL+"state")
  }


  getbyStates(_id:string):Observable<any> {
    return this.httpclient.get(URL+"state?country="+_id)
  }

  getNameByStates(name:string):Observable<any>{
    return this.httpclient.get(URL+"state?name="+name)
  }

  getdistricts(_id:string):Observable<any>{
    return this.httpclient.get(URL+"district?state="+_id)
  }

  getblocks(_id:string):Observable<any>{
    return this.httpclient.get(URL+"block?district_id="+_id)
  }

  getvillages(_id:string):Observable<any>{
    return this.httpclient.get(URL+"village?block="+_id)
  }


  getNameByCountry(name:string):Observable<any>{
    return this.httpclient.get(URL+"country?name="+name)
  }

  
  getIdByCountry(id:string):Observable<any>{
    return this.httpclient.get(URL+"country?_id="+id)
  }

}
