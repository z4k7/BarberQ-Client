export interface IUser extends Document{
    _id: string;
    name: string;
    email:string;
    mobile:string;
    password: string;
    is_blocked: boolean;
    token: string;
}