export interface IApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface IFilters {
  facilities: string[];
}
