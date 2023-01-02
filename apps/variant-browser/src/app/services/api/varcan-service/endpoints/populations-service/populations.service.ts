import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Population } from "../../models/response/Population";
@Injectable({
  providedIn: 'root'
})

/**
 * La clase PopulationsService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class PopulationsService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/populations) y el tipo que debe devolver (Population)
   * @param sort
   * @returns Promise<AxiosResponse<Array<Population>>>
   */
  fetch(sort?: string): Promise<AxiosResponse<Array<Population>>> {
    return sort !== null ? (this.getFetchService.fetch<undefined, Array<Population>>('/populations'))
    : (this.getFetchService.fetch<undefined, Array<Population>>('/populations'));
  }
}
