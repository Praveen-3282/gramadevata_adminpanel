import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  activeLink: string = '';
  private dialogRef: MatDialogRef<SignupComponent> | null = null;

  constructor( private router: Router,    private dialog: MatDialog,
  ){}

  

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
  this.router.navigate(['events']);
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
}
