import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';

import * as chromosomeOutputMockup from 'fixtures/varcanService/chromosome/output/chromosomeOutputMockup.json';
import { Chromosome } from 'src/app/models/Chromosome';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class ChromosomesService {
  readonly httpHandler: AxiosInstance;

  constructor(httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<Chromosome> {
    let chromosomeList: Array<Chromosome>;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, Array<Chromosome>>('/chromosomes')
      .then(response => {
        if(response) {
          console.log(response.data);
          chromosomeList = response.data;
        }
      })
      .catch(error => console.log("Error chromosomeService: " + error));
    return chromosomeList;
    /*let pruebaArray: Array<Chromosome> = chromosomeOutputMockup.chromosomes;
    return pruebaArray;   */ 
  }
}
