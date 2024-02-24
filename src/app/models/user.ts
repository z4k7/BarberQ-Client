export interface IUser extends Document{
    _id: string;
    name: string;
    email:string;
    mobile:string;
    password: string;
    isBlocked: boolean;
    accessToken: string;
    refreshToken: string;
}


export interface IApiTokenRes{
    status: number;
    message:string;
    accessToken: string;
}