import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VendorRegisterComponent } from './vendor-register/vendor-register.component';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';
import { loginGuard } from 'src/app/guards/login.guard';
import { authGuard } from 'src/app/guards/auth.guard';
import { VendorAddSalonComponent } from './vendor-add-salon/vendor-add-salon.component';
import { MapBoxComponent } from '../common/map-box/map-box.component';
import { VendorSalonsComponent } from './vendor-salons/vendor-salons.component';
import { VendorSalonDetailsComponent } from './vendor-salon-details/vendor-salon-details.component';

const routes: Routes = [
  { path: 'map', component: MapBoxComponent },
  {
    path: 'login',
    title: 'Vendor | Login',
    component: VendorLoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'register',
    title: ' Vendor | Register',
    component: VendorRegisterComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    title: 'Vendor | Home',
    component: VendorHomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'add-salon',
        title: 'Vendor | Add Salon',
        component: VendorAddSalonComponent,
      },
      {
        path: 'salon-list',
        title: 'Vendor | Salon List',
        component: VendorSalonsComponent,
      },
      {
        path: 'salon-details/:id',
        title: 'Vendor | Salon Details',
        component: VendorSalonDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRoutingModule {}
