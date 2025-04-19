import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constant';
import { MatDialog } from '@angular/material/dialog';
// import { OnlymemberComponent } from '../../components/member/onlymember/onlymember.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  isMemberIn = false

  isPujariIn = false
  
  

  constructor(private httpclient:HttpClient,private dialog:MatDialog,) { 
    
    let user = localStorage.getItem('is_member');
    this.isMemberIn = user != 'false';

    const storedIsPujariIn = localStorage.getItem('is_PujariIn');
    this.isPujariIn = storedIsPujariIn !== null && storedIsPujariIn === 'true';
  }



  isMemberUser() {
    const isMemberIn = localStorage.getItem("is_member") === "true";
  if (isMemberIn) {
    this.isMemberIn = true
  } else {
    this.isMemberIn = false
  } 
}
   
  

  // isPujariUser() {
  //   return this.isPujariIn;
  // }


  // showMemberModal(): void {
  //   this.openmemberDialog();
  // }


  // openmemberDialog(): void {
  //   console.log('sssssssssss');
  //   const dialogRef = this.dialog.open(OnlymemberComponent, {
  //     data: { displayName: 'signup' },
  //     autoFocus: false,
  //     backdropClass: 'dialog-backdrop',
  //   });
  
  //   dialogRef.afterClosed().subscribe(() => {
  //     // Handle after dialog close actions here
  //   });
  // }

  

  

  signup(userData: any): Observable<any> {
    return this.httpclient.post(URL+"register", userData);
  }

  verifyotp(userData: any): Observable<any> {
    return this.httpclient.post(URL+"verify", userData);
  }


  profiledata(id:any): Observable<any>{
    return this.httpclient.get(URL+"profile_get_by_id/"+id)
  }


  GetConnections(id:string):Observable<any>{
    return this.httpclient.get(URL+'connect?user='+id)
  }


  

  updateprofile(memberData: any, userId: any): Observable<any> {
    const url = `${URL}profile/`+userId;
    const data = { ...memberData,  };
  
    return this.httpclient.put(url, data);
  }


  updateroots(memberData: any, userId: any): Observable<any> {
    const url = `${URL}updateroots/`+userId;
    const data = { ...memberData,  };
  
    return this.httpclient.put(url, data);
  }

  DeleeFamilyImage(imagedata:any,userId: any):Observable<any> {
    return this.httpclient.post(URL+'deleteimage/'+userId, imagedata)
  }




}
