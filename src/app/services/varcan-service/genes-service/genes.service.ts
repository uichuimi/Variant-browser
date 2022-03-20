import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { Gene } from 'src/app/models/Gene';
import { Page } from 'src/app/models/Page';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GenesService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Page<Gene> {
    let geneList: Page<Gene>;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, Page<Gene>>('/genes')
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
