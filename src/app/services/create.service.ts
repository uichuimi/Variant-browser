import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';
import { ICreatable } from '../interfaces/ICreatable';

@Injectable({
  providedIn: 'root'
})
export class CreateService implements ICreatable {

  constructor(private httpHandler: AxiosInstance) { }
  create<T, U>(data: T, endpoint: string): U {
    const response = this.httpHandler.post(endpoint, data);
    return ;
  }
}
