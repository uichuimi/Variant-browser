import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { Gene } from "../../models/response/Gene";
import { GeneQueryParams } from "../../models/request/gene-query-params";

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
      this.postFetchService.fetch<GeneQueryParams, Array<Gene>>('/genes', data) :
      this.postFetchService.fetch<GeneQueryParams, Array<Gene>>('/genes');
  }
}
