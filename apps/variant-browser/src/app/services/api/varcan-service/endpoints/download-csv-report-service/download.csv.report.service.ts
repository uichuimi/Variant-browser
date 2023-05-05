import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PostFetchService } from '../fetch-service/post-fetch-service/post-fetch.service';
import { VariantParams } from "../../models/request/VariantParams";
import { Page } from "../../models/response/Page";
import { Variant } from "../../models/response/Variant";
import { CsvVariantReportParams } from "../../models/request/CsvVariantReportParams";

@Injectable({
  providedIn: 'root'
})
export class DownloadCsvReportService {
  readonly httpHandler: AxiosInstance;
  readonly postFetchService: PostFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.httpHandler.defaults.headers.common['Content-Type'] = 'text/csv';
    this.postFetchService = new PostFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de PostFetchService, especificando el punto
   * de ataque (/csv/variants) y el tipo que debe devolver un CSV
   * @param data modelo de entrada VariantsParams
   * @returns Promise<AxiosResponse<String>>
   */
  fetch(data?: CsvVariantReportParams): Promise<AxiosResponse<string>> {
    return data !== null ?
      this.postFetchService.fetch<CsvVariantReportParams, string>('/variants/csv', data) :
      this.postFetchService.fetch<CsvVariantReportParams, string>('/variants/csv');
  }
}
