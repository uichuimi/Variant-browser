import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import * as biotypeOutputMockup from 'fixtures/varcanService/biotype/output/biotypeOutputMockup.json';
import { Biotype } from 'src/app/models/output/Biotype';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})

/**
 * La clase BiotypeService se encarga de instanciar a GetFetchService, 
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class BiotypesService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  fetch(): Promise<AxiosResponse<Array<Biotype>>> {
    return this.getFetchService.fetch<undefined, Array<Biotype>>('/biotypes');  
  }  
}
