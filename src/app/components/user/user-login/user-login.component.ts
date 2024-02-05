import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  form!: FormGroup
  isSubmitted = false
  backendURL = environment.baseURL

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit(): void{
    this.isSubmitted = true
    if (this.form.invalid) {
      this.toastr.error("Please check the provided inputs.")
    } else {
      const user = this.form.getRawValue()
      this.http.post(`${this.backendURL}/user/login`, user).subscribe({
        next: (res) => {
          localStorage.setItem('isUserLoggedIn','true')
          this.router.navigate(['/'])
        },
        error: (err) => {
          this.toastr.error('Error',err.error.message)
        }
      })
    }
  }


}
