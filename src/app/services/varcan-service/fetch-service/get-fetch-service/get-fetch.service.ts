import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GetFetchService extends FetchService {

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    super(httpHandler);
  }

  fetch<T, U>(endpoint: string, data?: T, query?: object): Promise<AxiosResponse<U>> {
    return query !== null ? this.httpHandler.get<U>(endpoint, query) : this.httpHandler.get<U>(endpoint);
  }
}
