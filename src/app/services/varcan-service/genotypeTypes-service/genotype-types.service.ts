import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { GenotypeType } from 'src/app/models/output/GenotypeType';
import { Impact } from 'src/app/models/output/Impact';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GenotypeTypesService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<GenotypeType> {
    let genotypeTypeList: Array<GenotypeType>;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, Array<GenotypeType>>('/genotype_type')
      .then(response => {
        if(response) {
          console.log(response.data);
          genotypeTypeList = response.data;
        }
      })
      .catch(error => console.log("Error genotypeTypeService: " + error));
    return genotypeTypeList;   
  } 
}
