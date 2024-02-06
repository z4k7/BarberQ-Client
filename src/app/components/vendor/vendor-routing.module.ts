import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VendorRegisterComponent } from './vendor-register/vendor-register.component';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';


const routes: Routes = [
  {
    path: 'login',
    title: 'Vendor | Login',
    component: VendorLoginComponent
  },
  {
    path: 'register',
    title: ' Vendor | Register',
    component: VendorRegisterComponent
  },
  {
    path: 'home',
    title: 'Vendor | Home',
    component: VendorHomeComponent
  },
 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
