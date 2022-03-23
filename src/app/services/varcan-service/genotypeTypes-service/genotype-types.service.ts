import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { GenotypeType } from 'src/app/models/output/GenotypeType';
import { Impact } from 'src/app/models/output/Impact';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GenotypeTypesService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  fetch(): Promise<AxiosResponse<Array<GenotypeType>>> {
    return this.getFetchService.fetch<undefined, Array<GenotypeType>>('/genotype_type');  
  } 
}
