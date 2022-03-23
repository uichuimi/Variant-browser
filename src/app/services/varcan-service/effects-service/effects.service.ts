import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Effect } from 'src/app/models/output/Effect';

@Injectable({
  providedIn: 'root'
})
export class EffectsService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  fetch(): Promise<AxiosResponse<Array<Effect>>> {
    return this.getFetchService.fetch<undefined, Array<Effect>>('/effects'); 
  } 
}
