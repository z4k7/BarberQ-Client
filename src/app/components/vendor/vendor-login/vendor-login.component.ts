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
import { IVendorLoginResponse } from 'src/app/models/vendor';

@Component({
  selector: 'app-vendor-login',
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.css'],
})
export class VendorLoginComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  hide: boolean = true;
  invalid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
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
      const vendor = this.form.getRawValue();
      this.http
        .post<IVendorLoginResponse>(`/vendor/login`, vendor, {
          withCredentials: true,
        })
        .subscribe({
          next: (res) => {
            console.log(`Response from vendor login`, res);

            if (res.data && res.data.accessToken && res.data.refreshToken) {
              localStorage.setItem('vendorJwtAccess', res.data.accessToken);
              localStorage.setItem('vendorJwtRefresh', res.data.refreshToken);
              this.router.navigate(['/vendor']);
            } else {
              console.error('Invalid response format:', res);
              this.toastr.error('Invalid response format');
            }
          },
        });
    }
  }
}
