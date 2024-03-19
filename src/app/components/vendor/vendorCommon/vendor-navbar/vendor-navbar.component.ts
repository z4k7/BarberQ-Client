import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IVendor } from 'src/app/models/vendor';
import { deleteVendor } from 'src/app/state/vendor-store/vendor.actions';
import { selectVendorDetails } from 'src/app/state/vendor-store/vendor.selector';

@Component({
  selector: 'app-vendor-navbar',
  templateUrl: './vendor-navbar.component.html',
  styleUrls: ['./vendor-navbar.component.css'],
})
export class VendorNavbarComponent implements OnInit, OnDestroy {
  vendorState$ = this.store.select(selectVendorDetails);
  vendorData!: IVendor;
  vendorSubscription!: Subscription;

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.vendorSubscription = this.vendorState$.subscribe((vendor) => {
      if (vendor) this.vendorData = vendor;
    });
  }

  ngOnDestroy(): void {
    this.vendorSubscription.unsubscribe();
  }

  onLogout(): void {
    localStorage.removeItem('vendorJwtAccess');
    localStorage.removeItem('vendorJwtRefresh');
    this.store.dispatch(deleteVendor());
    this.router.navigate(['/vendor/login']);
  }
}
