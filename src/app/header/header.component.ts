import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  activeLink: string = '';
  user: any;
  userid: any;


  private dialogRef: MatDialogRef<SignupComponent> | null = null;

  constructor( private router: Router,    private dialog: MatDialog,    protected authenticationService:AuthenticationService,private userservice:UserService

  ){}

  
  ngOnInit(){


    // this.profiledata();
    this.getUserProfile();
    
  }

navigateTotemples(): void {
  this.activeLink = 'temples';
  this.router.navigate(['temples']);
}

navigategoshala(): void {
  this.activeLink = 'goshalas';
  this.router.navigate(['goshalas']);
}

navigateevents(): void {
  this.activeLink = 'events';
  this.router.navigate(['/events']);
}

navigatevillages(): void {
  this.activeLink = 'villages';
  this.router.navigate(['villages']);
}


// signup(): void{
//   this.router.navigate(['signup'])
// }


signup(): void {
  // Check if dialog is already open
  if (this.dialogRef) {
    return; // Prevent opening multiple dialogs
  }

  this.dialogRef = this.dialog.open(SignupComponent, {
    data: { displayName: 'signup' },
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
  });

  // Reset dialogRef when dialog is closed
  this.dialogRef.afterClosed().subscribe(() => {
    this.dialogRef = null;
  });
}



doLogout(){
  this.authenticationService.logout();
}


getUserProfile(): void {
  const userId = localStorage.getItem('user'); 
  this.userservice.profiledata(userId).subscribe(
    (data) => {
      this.user = data;
    },
    (error) => {
      console.error('Error fetching user data:', error);
    }
  );
}


handleProfileImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/profile1.png';
}

isSmallScreen = window.innerWidth < 992;


checkScreenSize(): void {
  this.isSmallScreen = window.innerWidth < 992;
}

getButtonClasses(): string[] {
  if (this.isSmallScreen) {
    return ['nav-link'];
  } else {
    return ['btn', 'btn-primary', 'rounded-pill'];
  }
}


openSignupDialog(): void {
  // Check if dialog is already open
  if (this.dialogRef) {
    return; // Prevent opening multiple dialogs
  }

  this.dialogRef = this.dialog.open(SignupComponent, {
    data: { displayName: 'signup' },
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
  });

  // Reset dialogRef when dialog is closed
  this.dialogRef.afterClosed().subscribe(() => {
    this.dialogRef = null;
  });
}

navigateTo(): void {
  const ismember = localStorage.getItem('is_member') === 'true'; // Compare as string

  if (ismember) {
    this.userid = localStorage.getItem('user')
    this.router.navigate(['profile',this.userid]);
  } else {
    // this.userservice.showMemberModal();
  }
}
}
