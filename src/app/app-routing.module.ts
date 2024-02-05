import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'user', title: 'User', loadChildren: () => import('./components/user/user.module').then(m => m.UserModule) },
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
