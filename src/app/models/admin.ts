export interface AdminData {
  _id: string;
  name: string;
  email: string;
}

export interface AdminApiResponse {
  status: number;
  data: {
    adminData: AdminData;
    accessToken: string;
    refreshToken: string;
  };
}
