import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRegisterComponent } from './user-register/user-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserHomeComponent } from './user-home/user-home.component';

const routes: Routes = [
  {
    path: 'login',
    title: 'BarberQ | Login',
    component: UserLoginComponent
  },
  {
    path: 'register',
    title: 'BarberQ | Register',
    component: UserRegisterComponent
  },  {
    path: '',
    title: 'BarberQ | Home',
    component: UserHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
  
 }
