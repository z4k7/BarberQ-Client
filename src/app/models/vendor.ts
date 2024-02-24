export interface IVendor extends Document{
    _id: string;
    name: string;
    email:string;
    mobile:string;
    password: string;
    isBlocked: boolean;
    accessToken: string;
    refreshToken: string;
}