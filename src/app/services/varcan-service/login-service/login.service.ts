import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { Login } from 'src/app/models/input/Login';
import { Token } from 'src/app/models/output/Token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(data: Login): Token {
    let token: Token;
    const postFetchService = new PostFetchService(this.httpHandler);
    postFetchService.fetch<Login, Token>('/login', data)
      .catch(error => console.log("Error loginService: " + error))
      .then(response => {
        if(response) {
          token = response.data;
        }
      });
    return token;
  } 
}
