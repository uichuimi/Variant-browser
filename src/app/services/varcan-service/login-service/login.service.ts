import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { Login } from 'src/app/models/input/Login';
import { Token } from 'src/app/models/output/Token';

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

  /**
   * Usa el método fetch de PostFetchService, especificando el punto
   * de ataque (/login) y el tipo que debe devolver (Token)
   * @param data datos que se insertan en el body de la llamada
   * @returns Promise<AxiosResponse<Token>>
   */
  fetch(data: Login): Promise<AxiosResponse<Token>> {
    return this.postFetchService.fetch<Login, Token>('/login', data);
  } 
}
