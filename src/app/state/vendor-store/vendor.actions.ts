import { createAction, props } from '@ngrx/store';
import { IVendor } from 'src/app/models/vendor';

export const saveVendor = createAction(
  '[Vendor] SaveVendor',
  props<{ vendorDetails: IVendor }>()
);
export const deleteVendor = createAction('[Vendor] DeleteVendor');
