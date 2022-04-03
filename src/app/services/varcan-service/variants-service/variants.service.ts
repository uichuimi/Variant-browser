import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { Page } from 'src/app/models/output/Page';
import { Variant } from 'src/app/models/output/Variant';
import { VariantParams } from 'src/app/models/input/VariantParams';

@Injectable({
  providedIn: 'root'
})
export class VariantsService {
  readonly httpHandler: AxiosInstance;
  readonly postFetchService: PostFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.postFetchService = new PostFetchService(this.httpHandler);
  }

  fetch(data?: VariantParams): Promise<AxiosResponse<Page<Variant>>> {
    return data !== null ? 
      this.postFetchService.fetch<VariantParams, Page<Variant>>('/variants', data) : 
      this.postFetchService.fetch<VariantParams, Page<Variant>>('/variants', data);
  } 
}
