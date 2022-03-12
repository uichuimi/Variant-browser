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

/*  fetch<T, U>(endpoint: string, data?: T, query?: object): U {
    const response = this.httpHandler.get(endpoint); 
    return response.data;   
  }*/
}
