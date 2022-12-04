import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { GeneQueryParams } from "../../../models/input/GeneQueryParams";
import { Page } from "../../../models/output/Page";
import { Gene } from "../../../models/output/Gene";

@Injectable({
  providedIn: 'root'
})

/**
 * La clase GenesService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class GenesService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/genes) y el tipo que debe devolver (Gene)
   * @param query datos que se le pasan a la query string de la llamada
   * @returns Promise<AxiosResponse<Page<Gene>>>
   */
  fetch(query?: GeneQueryParams): Promise<AxiosResponse<Page<Gene>>> {
    return query !== null ? this.getFetchService.fetch<GeneQueryParams, Page<Gene>>('/genes', undefined, query)
      : this.getFetchService.fetch<undefined, Page<Gene>>('/genes');
  }
}
