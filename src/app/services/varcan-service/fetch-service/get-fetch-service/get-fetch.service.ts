import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GetFetchService extends FetchService {

  constructor(httpHandler: AxiosInstance) {
    super(httpHandler);
  }

  async fetch<T, U>(endpoint: string, data?: T, query?: object): Promise<U> {
    const response = await this.httpHandler.get(endpoint, query);
    return response.data;   
  }
}
