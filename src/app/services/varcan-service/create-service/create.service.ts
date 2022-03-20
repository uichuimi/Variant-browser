import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { ICreatable } from 'src/app/interfaces/ICreatable';

@Injectable({
  providedIn: 'root'
})
export class CreateService implements ICreatable {

  constructor(@Inject(axios) private httpHandler: AxiosInstance) { }
  create<T, U>(data: T, endpoint: string): U {
    const response = this.httpHandler.post(endpoint, data);
    return ;
  }
}
