import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Population } from 'src/app/models/output/Population';

@Injectable({
  providedIn: 'root'
})
export class PopulationsService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  fetch(sort?: string): Promise<AxiosResponse<Array<Population>>> {
    return sort !== null ? (this.getFetchService.fetch<undefined, Array<Population>>('/populations')) 
    : (this.getFetchService.fetch<undefined, Array<Population>>('/populations'));
  } 
}
