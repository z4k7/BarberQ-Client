import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { formatTime } from 'src/app/helpers/timer';

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
  oHide = true;
  pHide = true;
  cHide = true;

  remainingTime = 0;
  formattedTime: string = '00:30';
  otpResendCount: number = 0;
  showOtpResend: boolean = true;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^[a-zA-Z]*$'),
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
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
      },
      {
        validator: this.passwordsMatch,
      }
    );
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

  passwordsMatch: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  startTimer(): void {
    this.remainingTime = 30;

    const timer = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(timer);
        console.log(`Otp Expired`);
      }
      this.formattedTime = formatTime(this.remainingTime);
    }, 1000);
  }

  resendOtp(): void {
    if (this.otpResendCount < 3) {
      this.http.get('/user/resend-otp').subscribe({
        next: () => {
          console.log(`ResendOtp sent successfully`);
          this.toastr.success(
            'Please enter new otp',
            'OTP Resend Successfully'
          );
          this.startTimer();
          this.otpResendCount++;
        },
      });
    } else {
      this.toastr.info('Maximum resend attempts reached', 'Oops!');
    }
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
        this.http.post(`/user/register`, user).subscribe({
          next: (res) => {
            console.log(`Response from register`, res);
            this.showOtpField = true;
            this.form.get('otp')?.enable();
            this.toastr.success(
              ' Enter OTP',
              'User details submitted successfully.'
            );
            this.startTimer();

            setTimeout(() => {
              this.showOtpResend = false;
            }, 1000 * 3);
          },
        });
      } else {
        const enteredOTP = this.form.get('otp')?.value;

        // Call backend to verify OTP
        this.http
          .post(`/user/verifyOtp`, {
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
          });
      }
    }
  }
}
