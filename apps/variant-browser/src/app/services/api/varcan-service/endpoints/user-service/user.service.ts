import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { User } from 'src/app/models/response/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/user) y el tipo que debe devolver (User)
   * @returns Promise<AxiosResponse<User>>
   */
  fetch(): Promise<AxiosResponse<User>> {
    return this.getFetchService.fetch<undefined, User>('/user');
  }
}
