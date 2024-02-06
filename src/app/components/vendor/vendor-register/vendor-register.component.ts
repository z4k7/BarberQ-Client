import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
  styleUrls: ['./vendor-register.component.css']
})
export class VendorRegisterComponent implements OnInit {

  form !: FormGroup;
  isSubmitted = false;
  showOtpField = false;
  backendURL = environment.baseURL

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private toastr : ToastrService
  ) { }
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      otp: [{value: '', disabled: false}]
       })
  }

  handleError(err: any): string{
    return err.error ? err.error.message : 'Unknown error'
  }

  onSubmit(): void{
    this.isSubmitted = true

    if (this.showOtpField && this.form.controls['otp'].invalid) {
      this.toastr.error('Please enter the OTP')
      return
    }
    if (this.form.invalid) {
      this.toastr.error('Please check the provided input')
    } else {
      const vendor = this.form.getRawValue();
      
      if (!this.showOtpField) {
        this.http.post(`${this.backendURL}/vendor/register`, vendor).subscribe({
          next: () => {
            this.showOtpField = true
            this.toastr.success(
              'Vendor Details Submitted Successfully. Enter OTP.'
            );
          },
          error: (err) => {
            this.toastr.error('Error', this.handleError(err));
          },
        });
      } else {
        const enteredOTP = this.form.get('otp')?.value;

        this.http.post(`${this.backendURL}/vendor/verifyOtp`, {
          email: vendor.email,
          otp : enteredOTP,
        }).subscribe({
          next: () => {
            this.toastr.success('OTP verification successful. Redirecting to login page.');
            this.router.navigate(['/vendor/login'])

          },
          error: (err) => {
            this.toastr.error('Error', this.handleError(err))
          }
        })
      }
    }

  }

}
