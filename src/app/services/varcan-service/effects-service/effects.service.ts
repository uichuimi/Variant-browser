import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { Effect } from 'src/app/models/output/Effect';

@Injectable({
  providedIn: 'root'
})
export class EffectsService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<Effect> {
    let effectList: Array<Effect>;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, Array<Effect>>('/effects')
      .then(response => {
        if(response) {
          console.log(response.data);
          effectList = response.data;
        }
      })
      .catch(error => console.log("Error effectService: " + error));
    return effectList;   
  } 
}
