export interface IVendor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  isBlocked: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface IVendorLoginResponse {
  status: number;
  data: {
    vendorData: IVendor;
    accessToken: string;
    refreshToken: string;
  };
}
