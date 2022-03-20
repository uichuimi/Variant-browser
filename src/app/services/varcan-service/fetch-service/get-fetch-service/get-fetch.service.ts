import { Injectable } from '@angular/core';
import { AxiosInstance, AxiosResponse } from 'axios';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GetFetchService extends FetchService {

  constructor(httpHandler: AxiosInstance) {
    super(httpHandler);
  }

  fetch<T, U>(endpoint: string, data?: T, query?: object): Promise<AxiosResponse<U>> {
    return this.httpHandler.get(endpoint, query);
  }
}
