import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import * as biotypeOutputMockup from 'fixtures/varcanService/biotype/output/biotypeOutputMockup.json';
import { Biotype } from 'src/app/models/Biotype';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class BiotypesService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<Biotype> {
    let biotypeList: Array<Biotype>;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, Array<Biotype>>('/biotypes')
      .then(response => {
        if(response) {
          console.log(response.data);
          biotypeList = response.data;
        }
      })
      .catch(error => console.log("Error biotypeService: " + error));
    return biotypeList;   
  }  
}
