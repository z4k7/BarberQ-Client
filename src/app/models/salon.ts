import { IService } from './service';

export interface ISalon {
  _id: string;
  vendorId: string;
  salonName: string;
  banners: string[];
  chairCount: string;
  contactNumber: string;
  createdAt: string;
  district: string;
  facilities: string[];
  landmark: string;
  locality: string;
  openingTime: string;
  closingTime: string;
  location: {
    longitude: number;
    latitude: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  services: any;
  status: string;
  updatedAt: string;
}

export interface ISalonApiResponse {
  status: number;
  data: ISalon;
}
