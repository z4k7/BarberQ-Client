import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'user', title: 'User', loadChildren: () => import('./components/user/user.module').then(m => m.UserModule) },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
  {
    path :'vendor', title : 'Vendor', loadChildren: ()=> import('./components/vendor/vendor.module').then(m=>m.VendorModule) },
    // {
    //   path: '',
    //   redirectTo: 'vendor',
    //   pathMatch:'full'
    // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
