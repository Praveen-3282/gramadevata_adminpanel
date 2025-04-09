import { Component,Inject} from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// import { NotificationHelper } from '../commons/notification';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-verify',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  verifyForm!: FormGroup;
  username:string;
  memberstatus: any;
  isDisabled = false;
  countdown: number=0;

  constructor(private userService:UserService,
     private fb:FormBuilder,
     public dialogRef: MatDialogRef<VerifyComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
    //  private notificationHelper: NotificationHelper,
     private authenticationService: AuthenticationService,
     private userservice:UserService,
    //  private spinner: NgxSpinnerService,
     private dialog: MatDialog,
     
    //  private headercomponent:HeaderComponent
     
    ){
      this.username = data.username;
  }

  ngOnInit():void{
    this.verifyForm = this.fb.group({
      verification_otp: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
    });
    this.disableScroll();
  }
  ngOnDestroy(): void {
    this.enableScroll();
  }
  disableScroll() {
    document.body.style.overflow = 'hidden'; // Prevents scrolling
  }
  enableScroll() {
    document.body.style.overflow = 'auto'; // Enables scrolling back
  }


  resendOtp(): void {
    // Disable button and start countdown
    this.isDisabled = true;
    this.countdown = 30;
  
    // Start countdown
    const interval = setInterval(() => {
      this.countdown--;
  
      if (this.countdown === 0) {
        clearInterval(interval);
        this.isDisabled = false;
      }
    }, 1000);
  
    // Prepare the user data for the OTP resend request
    const userData = {
      username: this.username,  // Assuming `this.username` is already defined
    };
  
    console.log(userData, "Resend OTP Request Data");
  
    // Call the resend OTP service
    this.userService.signup(userData).subscribe(
      response => {
        console.log('Resend OTP successful', response);
        // Handle successful OTP resend response
      },
      error => {
        console.error('Resend OTP failed', error);
        // Handle resend OTP error
      }
    );
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      // this.spinner.show();
      const verificationData = {
        username: this.username,
        verification_otp: this.verifyForm.value.verification_otp
      };
      this.userService.verifyotp(verificationData).subscribe(
        response => {
          console.log('OTP verified successfully', response);
          this.dialogRef.close(true);
          // this.notificationHelper.showSuccessNotification('Login Success', '');
          let loginRresponsees = JSON.parse(JSON.stringify(response));
          loginRresponsees?.access
          ? localStorage.setItem('token', loginRresponsees.access)
          : null;
          loginRresponsees?.refresh
          ? localStorage.setItem('refresh', loginRresponsees.refresh)
          : null;
          loginRresponsees?.user_id
          ? localStorage.setItem('user', loginRresponsees.user_id)
          : null;
          loginRresponsees?.username
          ? localStorage.setItem('username', loginRresponsees.username)
          : null;
          loginRresponsees?.is_member
          ? localStorage.setItem('is_member', loginRresponsees.is_member)
          : null;
          loginRresponsees?.type
          ? localStorage.setItem('type', loginRresponsees.type)
          : null;
          loginRresponsees?.profile_pic
          ? localStorage.setItem('profile_pic', loginRresponsees.profile_pic)
          : null;

          loginRresponsees?.full_name
          ? localStorage.setItem('full_name', loginRresponsees.full_name)
          : null;
          
        
 
        this.authenticationService.isLoggedIn = true;
        window.location.reload();
        this.dialogRef.close()
        // this.spinner.hide()
        
        // this.router.navigate(['/home']);
        },
        error => {
          console.error('Error verifying OTP', error);
          // this.notificationHelper.showErrorNotification('Invalid Otp');
          this.verifyForm.markAllAsTouched();
          // this.spinner.hide()
         
        }
      );
    } else {
      this.markAllAsTouched();
      // this.spinner.hide()
    }
  }


  private markAllAsTouched() {
    Object.keys(this.verifyForm.controls).forEach(field => {
      const control = this.verifyForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

    closeForm() {
      this.dialogRef.close(); 
    }
    
}
