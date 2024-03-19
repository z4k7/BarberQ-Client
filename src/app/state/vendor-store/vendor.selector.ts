import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IVendorState } from './vendor.reducer';

export const selectVendorState = createFeatureSelector<IVendorState>('vendor');
export const selectVendorDetails = createSelector(
  selectVendorState,
  (state: IVendorState) => state.vendorDetails
);
