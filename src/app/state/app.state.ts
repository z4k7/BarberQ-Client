import * as fromVendor from './vendor-store/vendor.reducer';
import * as fromUser from './user-store/user.reducer';

export interface RootState {
  vendor: fromVendor.IVendorState;
  user: fromUser.IUserState;
}

export const Reducers = {
  vendor: fromVendor.vendorReducer,
  user: fromUser.userReducer,
};
