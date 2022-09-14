import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { Gene } from 'src/app/models/output/Gene';
import { Page } from 'src/app/models/output/Page';
import { GeneParams } from 'src/app/models/input/GeneParams';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

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
  fetch(query?: GeneParams): Promise<AxiosResponse<Page<Gene>>> {
    return query !== null ? this.getFetchService.fetch<GeneParams, Page<Gene>>('/genes', undefined, query) 
      : this.getFetchService.fetch<undefined, Page<Gene>>('/genes');
  }  
}
