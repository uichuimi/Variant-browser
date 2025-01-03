import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Sample } from "../../models/response/Sample";

@Injectable({
  providedIn: 'root'
})

/**
 * La clase SampleService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class SampleService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/samples) y el tipo que debe devolver (Sample)
   * @returns Promise<AxiosResponse<Array<Sample>>>
   */
  fetch(): Promise<AxiosResponse<Array<Sample>>> {
    return this.getFetchService.fetch<undefined, Array<Sample>>('/samples');
  }
}
