import { AxiosResponse } from "axios";

export interface ICreatable {
    create<T,U>(endpoint: string, data: T): Promise<AxiosResponse<U>>;
}