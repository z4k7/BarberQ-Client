import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  backendURL = environment.baseURL;
  hide:boolean = true;
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

  get email(): FormControl{
    return this.form.get('email') as FormControl
  }

  get password():FormControl{
    return this.form.get('password') as FormControl
  }


  onSubmit(): void{
    this.isSubmitted = true
    if (this.form.invalid) {
      this.invalid = true
      this.toastr.error('Please check the provided inputs.');
      return;
    } else {
      const admin = this.form.getRawValue()
      this.http.post(`${this.backendURL}/admin/login`, admin).subscribe({
        next:(res:any)=>{
          localStorage.setItem('adminJwt', res.data.token)
          this.router.navigate(['/admin'])
        },
        error: (err) => {
          console.log(`Error During Login`, err);
          let errorMessage = ' An error occurred during login.';
          if(err.error && err.error.data && err.error.data.message){
            errorMessage = err.error.data.message;
          }
          this.toastr.error(errorMessage)
        }
      })
    }
  }
}
