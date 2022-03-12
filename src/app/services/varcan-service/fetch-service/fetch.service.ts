import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';
import { IReadable } from 'src/app/interfaces/IReadable';

@Injectable({
  providedIn: 'root'
})
export class FetchService implements IReadable {

  constructor(protected httpHandler: AxiosInstance) { }

  fetch<T, U>(endpoint: string, data?: T, query?: object): U {
    throw new Error('Method not implemented.');
  }
  
}
