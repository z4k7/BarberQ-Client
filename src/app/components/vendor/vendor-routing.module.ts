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
import { VendorSalonEditComponent } from './vendor-salon-edit/vendor-salon-edit.component';
import { VendorOverviewComponent } from './vendor-overview/vendor-overview.component';
import { VendorBookingsComponent } from './vendor-bookings/vendor-bookings.component';
import { VendorSalonOverviewComponent } from './vendor-salon-overview/vendor-salon-overview.component';

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
        path: 'overview',
        title: 'Vendor | Overview ',
        component: VendorOverviewComponent,
      },
      {
        path: 'bookings',
        title: 'Vendor | Bookings ',
        component: VendorBookingsComponent,
      },
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
      {
        path: 'salon-overview/:id',
        title: 'Vendor | Salon Overview',
        component: VendorSalonOverviewComponent,
      },
      {
        path: 'salon-edit/:id',
        title: 'Vendor | Salon Edit',
        component: VendorSalonEditComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRoutingModule {}
