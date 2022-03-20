import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Impact } from 'src/app/models/output/Impact';
import { Individual } from 'src/app/models/output/Individual';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class IndividualsService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<Individual> {
    let individualList: Array<Individual>;
    const getFetchService = new GetFetchService(this.httpHandler);
    getFetchService.fetch<null, Array<Individual>>('/individuals')
      .then(response => {
        if(response) {
          console.log(response.data);
          individualList = response.data;
        }
      })
      .catch(error => console.log("Error individualService: " + error));
    return individualList;   
  } 
}
