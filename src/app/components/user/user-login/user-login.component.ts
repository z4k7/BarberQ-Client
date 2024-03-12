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
import { UserLoginResponse } from 'src/app/models/user';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  hide: boolean = true;
  invalid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.invalid) {
      this.invalid = true;
      this.toastr.error('Please check the provided inputs.');
      return;
    } else {
      const user = this.form.getRawValue();
      this.http
        .post<UserLoginResponse>(`/user/login`, user, { withCredentials: true })
        .subscribe({
          next: (res) => {
            console.log(`response of user login:`, res);
            if (res.data && res.data.accessToken && res.data.refreshToken) {
              localStorage.setItem('userJwtAccess', res.data.accessToken);
              localStorage.setItem('userJwtRefresh', res.data.refreshToken);
              this.router.navigate(['/']);
            } else {
              console.error('Invalid response format:', res);
              this.toastr.error('Invalid response format');
            }
          },
        });
    }
  }
}
