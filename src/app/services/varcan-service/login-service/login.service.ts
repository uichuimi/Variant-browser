import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { Login } from 'src/app/models/input/Login';
import { Token } from 'src/app/models/output/Token';
import { GeneParams } from 'src/app/models/input/GeneParams';

@Injectable({
  providedIn: 'root'
})

/**
 * La clase LoginService se encarga de instanciar a PostFetchService, 
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class LoginService {
  readonly httpHandler: AxiosInstance;
  readonly postFetchService: PostFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.postFetchService = new PostFetchService(this.httpHandler);
  }

  fetch(data: Login): Promise<AxiosResponse<Token>> {
    return this.postFetchService.fetch<Login, Token>('/login', data);
  } 
}
