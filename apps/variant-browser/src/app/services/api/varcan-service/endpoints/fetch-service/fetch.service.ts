import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IReadable } from "../../../../../interfaces/IReadable";

@Injectable({
  providedIn: 'root'
})
export class FetchService implements IReadable {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch<T, U>(endpoint: string, data?: T, query?: object): Promise<AxiosResponse<U>> {
    console.log("dummy");
    throw new Error('Method not implemented.');
  }

}
