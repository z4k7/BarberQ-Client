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

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
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
      const admin = this.form.getRawValue();
      this.http
        .post(`/admin/login`, admin, {
          withCredentials: true,
        })
        .subscribe({
          next: (res: any) => {
            if (res.data && res.data.accessToken && res.data.refreshToken) {
              localStorage.setItem('adminJwtAccess', res.data.accessToken);
              localStorage.setItem('adminJwtRefresh', res.data.refreshToken);
              this.router.navigate(['/admin']);
            } else {
              console.error('Invalid response format:', res);
              this.toastr.error('Invalid response format');
            }
          },
        });
    }
  }
}
