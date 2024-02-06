import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',

  styleUrls: ['./user-register.component.css'],
})
export class UserRegisterComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  showOtpField = false;
  remainingTime = 0;
  formattedTime: string = '03:00';
  otpResendCount: number = 0;
  showOtpResend: boolean = true;
  backendURL = environment.baseURL;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      otp: [{ value: '', disabled: false }],
    });
  }

  handleError(err: any): string {
    return err.error ? err.error.message : 'Unknown error';
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.showOtpField && this.form.controls['otp'].invalid) {
      this.toastr.error('Please enter the OTP');
      return;
    }

    if (this.form.invalid) {
      this.toastr.error('Please check the provided input');
    } else {
      const user = this.form.getRawValue();

      if (!this.showOtpField) {
        // Submit user details
        this.http.post(`${this.backendURL}/user/register`, user).subscribe({
          next: () => {
            this.showOtpField = true;
            this.toastr.success(
              'User details submitted successfully. Enter OTP.'
            );
          },
          error: (err) => {
            this.toastr.error('Error', this.handleError(err));
          },
        });
      } else {
        const enteredOTP = this.form.get('otp')?.value;

        // Call backend to verify OTP
        this.http
          .post(`${this.backendURL}/user/verifyOtp`, {
            email: user.email,
            otp: enteredOTP,
          })
          .subscribe({
            next: () => {
              // After successful OTP verification, redirect to login page
              this.toastr.success(
                'OTP verification successful. Redirecting to login page.'
                );
                this.router.navigate(['/user/login']);
            },
            error: (err) => {
              this.toastr.error('Error', this.handleError(err));
            },
          });
      }
    }
  }
}
