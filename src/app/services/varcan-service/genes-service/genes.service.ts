import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { Gene } from 'src/app/models/output/Gene';
import { Page } from 'src/app/models/output/Page';
import { GeneParams } from 'src/app/models/input/GeneParams';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GenesService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(query?: GeneParams): Page<Gene> {
    let geneList: Page<Gene>;
    const getFetchService = new GetFetchService(this.httpHandler);

    getFetchService.fetch<GeneParams, Page<Gene>>('/genes', query)
      .then(response => {
        if(response) {
          console.log(response.data);
          geneList = response.data;
        }
      })
      .catch(error => console.log("Error geneService: " + error));
    return geneList;   
  }  
}
