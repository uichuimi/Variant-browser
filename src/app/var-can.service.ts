import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { RegisterService } from './services/register.service';

@Injectable({
  providedIn: 'root'
})
export class VarCanService extends ApiService {

  constructor(private httpHandler: AxiosInstance) {
    super(environment.serverUrl);
    this.httpHandler = axios.create({
      baseURL: this.url,
      timeout: 2000
    })
    let registerService: RegisterService = new RegisterService(this.httpHandler);
  }
}
