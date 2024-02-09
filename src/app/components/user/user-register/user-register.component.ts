import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  invalid: boolean = false;
  backendURL = environment.baseURL;
  oHide = true;
  pHide = true;
  cHide = true;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z].*'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      mobile: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('[0-9]*'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      otp: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get mobile(): FormControl {
    return this.form.get('mobile') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  get otp(): FormControl {
    return this.form.get('otp') as FormControl;
  }

  passwordsMatch(): boolean {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    return password === confirmPassword;
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
      this.invalid = true;
      this.toastr.error('Please check the provided input');
    } else {
      const user = this.form.getRawValue();

      if (!this.showOtpField) {
        this.http.post(`${this.backendURL}/user/register`, user).subscribe({
          next: () => {
            this.showOtpField = true;
            this.form.get('otp')?.enable();
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
