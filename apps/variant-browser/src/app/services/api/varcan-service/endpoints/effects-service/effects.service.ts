import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Effect } from "../../models/response/Effect";
@Injectable({
  providedIn: 'root'
})

/**
 * La clase EffectsService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class EffectsService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/effects) y el tipo que debe devolver (Effect)
   * @returns Promise<AxiosResponse<Array<Effect>>>
   */
  fetch(): Promise<AxiosResponse<Array<Effect>>> {
    return this.getFetchService.fetch<undefined, Array<Effect>>('/effects');
  }
}
