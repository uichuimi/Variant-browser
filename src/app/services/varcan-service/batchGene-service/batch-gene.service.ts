import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// MODELS
import { GeneParams } from 'src/app/models/input/GeneParams';

// SERVICES
import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { Gene } from 'src/app/models/output/Gene';

@Injectable({
  providedIn: 'root'
})
export class BatchGeneService {
  readonly httpHandler: AxiosInstance;
  readonly postFetchService: PostFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.postFetchService = new PostFetchService(this.httpHandler);    
  }

  fetch(data?): Promise<AxiosResponse<Array<Gene>>> {
    return data !== null ? 
      this.postFetchService.fetch<GeneParams, Array<Gene>>('/genes', data) : 
      this.postFetchService.fetch<GeneParams, Array<Gene>>('/genes');
  }  
}
