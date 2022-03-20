import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Impact } from 'src/app/models/output/Impact';

@Injectable({
  providedIn: 'root'
})
export class ImpactsService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<Impact> {
    let impactList: Array<Impact>;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, Array<Impact>>('/impacts')
      .then(response => {
        if(response) {
          console.log(response.data);
          impactList = response.data;
        }
      })
      .catch(error => console.log("Error impactService: " + error));
    return impactList;   
  } 
}
