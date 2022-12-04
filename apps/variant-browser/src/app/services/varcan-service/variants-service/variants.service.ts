import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { VariantParams } from "../../../models/input/VariantParams";
import { Page } from "../../../models/output/Page";
import { Variant } from "../../../models/output/Variant";

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

  /**
   * Usa el método fetch de PostFetchService, especificando el punto
   * de ataque (/variants) y el tipo que debe devolver (Variant)
   * @param data modelo de entrada VariantsParams
   * @returns Promise<AxiosResponse<Page<Variant>>>
   */
  fetch(data?: VariantParams): Promise<AxiosResponse<Page<Variant>>> {
    return data !== null ?
      this.postFetchService.fetch<VariantParams, Page<Variant>>('/variants', data) :
      this.postFetchService.fetch<VariantParams, Page<Variant>>('/variants');
  }
}
