import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { CreateService } from '../create-service/create.service';
import { Token } from 'src/app/models/output/Token';
import { Register } from 'src/app/models/input/Register';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(data: Register): Token {
    let token: Token;
    const createService = new CreateService(this.httpHandler);
    createService.create<Register, Token>('/register', data)
      .catch(error => console.log("Error registerService: " + error))
      .then(response => {
        if(response) {
          token = response.data;
        }
      });
    return token;
  } 
}
