import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Impact } from 'src/app/models/output/Impact';
import { Individual } from 'src/app/models/output/Individual';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})

/**
 * La clase IndividualsService se encarga de instanciar a GetFetchService, 
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class IndividualsService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/individuals) y el tipo que debe devolver (Individual)
   * @returns Promise<AxiosResponse<Array<Individual>>>
   */
  fetch(): Promise<AxiosResponse<Array<Individual>>> {
    return this.getFetchService.fetch<undefined, Array<Individual>>('/individuals');   
  } 
}
