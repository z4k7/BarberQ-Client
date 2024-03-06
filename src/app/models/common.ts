export interface IApiResponse<T>{
    status: number,
    message: string,
    data:T
}