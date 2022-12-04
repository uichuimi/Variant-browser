import { Injectable, Inject } from '@angular/core';
import axios, {AxiosInstance, AxiosResponse} from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Chromosome } from "../../../models/output/Chromosome";
@Injectable({
  providedIn: 'root'
})

/**
 * La clase ChromosomesService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class ChromosomesService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/chromosome) y el tipo que debe devolver (Chromosome)
   * @returns Promise<AxiosResponse<Array<Chromosome>>>
   */
  fetch(): Promise<AxiosResponse<Array<Chromosome>>> {
    return this.getFetchService.fetch<undefined, Array<Chromosome>>('/chromosomes');
  }
}
