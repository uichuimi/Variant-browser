import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Impact } from "../../../models/output/Impact";

@Injectable({
  providedIn: 'root'
})

/**
 * La clase ImpactsService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class ImpactsService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/impacts) y el tipo que debe devolver (Impact)
   * @returns Promise<AxiosResponse<Array<Impact>>>
   */
  fetch(): Promise<AxiosResponse<Array<Impact>>> {
    return this.getFetchService.fetch<undefined, Array<Impact>>('/impacts');
  }
}
