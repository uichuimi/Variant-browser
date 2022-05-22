import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { ApiService } from '../api.service';
import { RegisterService } from './register-service/register.service';

@Injectable({
  providedIn: 'root'
})
export class VarCanService extends ApiService {
  private httpHandler: AxiosInstance;

  constructor(private serverUrl: string) {
    super(serverUrl);
    this.httpHandler = axios.create({
      baseURL: this.url,
      timeout: 2000
    })
    let registerService: RegisterService = new RegisterService(this.httpHandler);
  }
}
