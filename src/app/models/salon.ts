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
  location: {
    longitude: number;
    latitude: number;
  };
  services: string[];
  status: string;
  updatedAt: string;
}

export interface ISalonApiResponse {
  status: number;
  data: ISalon;
}
