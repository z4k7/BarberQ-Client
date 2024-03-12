export interface IUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  isBlocked: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface UserLoginResponse {
  status: number;
  data: {
    userData: IUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface IApiTokenRes {
  status: number;
  message: string;
  accessToken: string;
}
