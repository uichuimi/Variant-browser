import { AxiosResponse } from "axios";

export interface IReadable {
    fetch<T,U>(endpoint: string, data?: T, query?: object): Promise<AxiosResponse<U>>;
}