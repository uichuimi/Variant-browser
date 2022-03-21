import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ICreatable } from 'src/app/interfaces/ICreatable';

@Injectable({
  providedIn: 'root'
})
export class CreateService implements ICreatable {
  private httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }
  
  create<T, U>(endpoint: string, data: T): Promise<AxiosResponse<U>> {
    return this.httpHandler.post(endpoint, data);
  }
}
