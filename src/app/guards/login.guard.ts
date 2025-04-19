// import { CanActivateFn } from '@angular/router';
// import { Injectable, inject } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   CanDeactivate,
//   Router,
//   RouterStateSnapshot,
//   UrlTree,
// } from '@angular/router';
// import { Observable } from 'rxjs';



// @Injectable({
//   providedIn: 'root',
// })


// export const loginGuard: CanActivateFn = (route, state) => {
//   constr
//   return true;
// };


import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { SignupComponent } from '../signup/signup.component';

import { UserService } from '../services/user.service'; 
import { MatDialog } from '@angular/material/dialog';
// import { OnlymemberComponent } from '../components/member/onlymember/onlymember.component';

@Injectable({
  providedIn: 'root',
})
export class LoggedinguardGuard implements CanActivate {
  ismember: any;

  // commonService = inject(CommonService);

  constructor(private router: Router, private dialog: MatDialog, private userservice:UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = localStorage.getItem('user');
    console.log('decfvgbn');
    if (user) {
      // this.ismember =this.userservice.isMemberIn
      
      

      return true;
      
    }
    console.log('aaaaaaaaaaaaaa');
    // this.router.navigate(['home']);
    this.openSignupDialog();
    return false;
  }

  openSignupDialog(): void {
    console.log('sssssssssss');
    const dialogRef = this.dialog.open(SignupComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle after dialog close actions here
    });
  }

}



