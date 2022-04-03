import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { CreateService } from '../create-service/create.service';
import { Register } from 'src/app/models/input/Register';
import { ResponseStatus } from 'src/app/models/output/ResponseStatus';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  readonly httpHandler: AxiosInstance;
  readonly createService: CreateService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.createService = new CreateService(this.httpHandler);
  }

  create(data: Register): Promise<AxiosResponse<ResponseStatus>> {
    return this.createService.create<Register,ResponseStatus>('/register', data);
  } 
}
