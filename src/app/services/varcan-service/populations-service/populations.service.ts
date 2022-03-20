import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Population } from 'src/app/models/output/Population';

@Injectable({
  providedIn: 'root'
})
export class PopulationsService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(sort?: string): Array<Population> {
    let populationList: Array<Population>;
    const getFetchService = new GetFetchService(this.httpHandler);
    sort !== null ? (getFetchService.fetch<String, Array<Population>>('/populations', sort)     // llamada con sort
      .then(response => {
        if(response) {
          console.log(response.data);
          populationList = response.data;
        }
      })
      .catch(error => console.log("Error populationService: " + error))) :
      (getFetchService.fetch<String, Array<Population>>('/populations')           // llamada sin sort
      .then(response => {
        if(response) {
          console.log(response.data);
          populationList = response.data;
        }
      })
      .catch(error => console.log("Error populationService: " + error)));
    return populationList;   
  } 
}
