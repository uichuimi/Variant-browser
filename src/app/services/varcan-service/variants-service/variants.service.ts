import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { Page } from 'src/app/models/output/Page';
import { Variant } from 'src/app/models/output/Variant';
import { VariantParams } from 'src/app/models/input/VariantParams';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {
  readonly httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(data?: VariantParams): Page<Variant> {
    let variantList: Page<Variant>;
    const postFetchService = new PostFetchService(this.httpHandler);
    data !== null ? (postFetchService.fetch<VariantParams, Page<Variant>>('/variants', data)
      .then(response => {
        if(response) {
          console.log(response.data);
          variantList = response.data;
        }
      })
      .catch(error => console.log("Error variantService: " + error))) :
      (postFetchService.fetch<VariantParams, Page<Variant>>('/variants')
        .then(response => {
          if(response) {
            console.log(response.data);
            variantList = response.data;
          }
        })
        .catch(error => console.log("Error variantService: " + error)));
    return variantList;   
  } 
}
