export interface IService extends Document{
    _id: string;
    serviceName: string;
    duration: string;
    category: string;
    isVisible: boolean;
}