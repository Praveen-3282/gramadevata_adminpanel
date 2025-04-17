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
  profile_pic:any;
  username:any;
  profileImageUrl: string = '../../assets/profile1.png';
  profileImageError: boolean =false


  private dialogRef: MatDialogRef<SignupComponent> | null = null;

  constructor( private router: Router,    private dialog: MatDialog,    protected authenticationService:AuthenticationService,private userservice:UserService

  ){}

  
  ngOnInit(){
    this.setProfileImage();
    this.loadUser();
    // this.profiledata();
    this.getUserProfile();
    
  }

  setProfileImage(): void {
    if (this.user && this.user.profile_pic) {
      this.profileImageUrl = this.user.profile_pic;
    } else {
      this.profileImageUrl = '../../assets/profile1.png';
    }
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


// handleProfileImageError(event: Event) {
//   const imgElement = event.target as HTMLImageElement;
//   imgElement.src = 'assets/profile1.png';
// }

loadUser(): void {
  // Fetch or assign your user object
  this.user = {
    full_name: 'John Doe',
    profile_pic: 'https://example.com/image.jpg' // Or null/undefined
  };

  this.profileImageError = false; // Reset error on load
}


handleProfileImageError(): void {
  this.profileImageError = true;
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


profiledata(){

  this.profile_pic = localStorage.getItem('profile_pic')
  this.username = localStorage.getItem('full_name')
}
}
