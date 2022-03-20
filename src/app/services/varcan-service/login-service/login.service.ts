import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Token } from 'src/app/models/Token';
import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

 /* fetch(): Token {
    let token: Token;
    const postFetchService = new PostFetchService(this.httpHandler);
    postFetchService.fetch('/login', {
      "username": "uichuimi",
      "password": "uichuimi01" })
      .catch(error => console.log("Error chromosomeService: " + error))
      .then(response => {
        if(response) {
          token = response.data;
        }
      });
    return token;
  }  */
}
