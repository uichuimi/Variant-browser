import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { Gene } from 'src/app/models/Gene';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GenesService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<Gene> {
    let geneList: Array<Gene>;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, Array<Gene>>('/genes')
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
