import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';
import { IReadable } from 'src/app/interfaces/IReadable';

@Injectable({
  providedIn: 'root'
})
export class FetchService implements IReadable {
  readonly httpHandler: AxiosInstance;

  constructor(httpHandler: AxiosInstance) { 
    this.httpHandler = httpHandler;
  }

  async fetch<T, U>(endpoint: string, data?: T, query?: object): Promise<U> {
    console.log("dummy");
    throw new Error('Method not implemented.');
  }
  
}
