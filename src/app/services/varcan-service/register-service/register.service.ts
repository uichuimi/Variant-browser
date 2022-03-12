import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';
import { CreateService } from '../create-service/create.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpHandler: AxiosInstance) {
    let createService: CreateService = new CreateService(this.httpHandler);
  }

  
}
