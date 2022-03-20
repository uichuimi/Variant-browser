import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { CreateService } from '../create-service/create.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(@Inject(axios) private httpHandler: AxiosInstance) {
    let createService: CreateService = new CreateService(this.httpHandler);
  }

  
}
