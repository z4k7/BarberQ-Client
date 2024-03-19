import { createReducer, on } from '@ngrx/store';
import { IVendor } from 'src/app/models/vendor';
import { deleteVendor, saveVendor } from './vendor.actions';

export interface IVendorState {
  vendorDetails: IVendor | null;
}

export const initialVendorState: IVendorState = {
  vendorDetails: null,
};

export const vendorReducer = createReducer(
  initialVendorState,
  on(saveVendor, (state, { vendorDetails }): IVendorState => {
    return { ...state, vendorDetails };
  }),
  on(deleteVendor, (state): IVendorState => {
    return { ...state, vendorDetails: null };
  })
);
