import { Injectable, Inject } from '@angular/core';
import axios, {AxiosInstance, AxiosResponse} from 'axios';

import { Chromosome } from 'src/app/models/output/Chromosome';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

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

  fetch(): Promise<AxiosResponse<Array<Chromosome>>> {
    return this.getFetchService.fetch<undefined, Array<Chromosome>>('/chromosomes');
  }
}
