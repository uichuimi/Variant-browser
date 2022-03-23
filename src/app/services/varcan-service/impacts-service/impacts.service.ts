import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Impact } from 'src/app/models/output/Impact';

@Injectable({
  providedIn: 'root'
})
export class ImpactsService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  fetch(): Promise<AxiosResponse<Array<Impact>>> {
    return this.getFetchService.fetch<undefined, Array<Impact>>('/impacts');  
  } 
}
