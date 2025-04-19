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
    return this.httpclient.get(URL+"temple_inactive")
  }

  getbytemple(_id:string):Observable<any>{
    return this.httpclient.get(URL+"templeget/_id/"+ _id)
  }


  updatetemple(_id:string):Observable<any>{
    return this.httpclient.get(URL+"temple_inactive_get/_id/"+ _id)
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

  updateTempleDetails(templeId: string, templeData: any): Observable<any> {
    const updateUrl = `${URL}temple/${templeId}`;  // Assuming the temple ID is passed in the URL
    return this.httpclient.put(updateUrl, templeData);
  }
  
  

  GetAllCountries():Observable<any>{
    return this.httpclient.get(URL+"country")
  }


  getbyStates(_id:string):Observable<any> {
    console.log("statessssssssssssssssssssssssssssssssssssssssssssssssssssssss")
    return this.httpclient.get(URL+"state?country="+_id)
  }
  // getbyStates(countryId: string): Observable<any> {
  //   console.log("Fetching states for country ID:", countryId);
  //   return this.httpclient.get(`http://127.0.0.1:8000/gramadevata/state?country=${countryId}`);
  // }
  
 
  getdistricts(_id:string):Observable<any>{
    return this.httpclient.get(URL+"district?state="+_id)
  }

  getblocks(_id:string):Observable<any>{
    return this.httpclient.get(URL+"block?district_id="+_id)
  }
  
  getvillages(_id:string):Observable<any>{
    return this.httpclient.get(URL+"village?block="+_id)
  }

  getTempleCategorybyId(_id:string):Observable<any>{
    return this.httpclient.get(URL+'templeCategeory?_id='+_id)
  }

  getpriority():Observable<any>{
    return this.httpclient.get(URL+"templepriority")
  }

  GetallCategories():Observable<any>{   
    return this.httpclient.get(URL+"templeCategeory")
  }
  
}
