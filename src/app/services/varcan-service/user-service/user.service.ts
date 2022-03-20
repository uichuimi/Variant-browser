import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { User } from 'src/app/models/output/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): User {
    let currentUser: User;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, User>('/impacts')
      .then(response => {
        if(response) {
          console.log(response.data);
          currentUser = response.data;
        }
      })
      .catch(error => console.log("Error userService: " + error));
    return currentUser;   
  } 
}
