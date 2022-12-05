import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { GetFetchService } from '../fetch-service/get-fetch-service/get-fetch.service';
import { GenotypeType } from "../../../../models/output/GenotypeType";

@Injectable({
  providedIn: 'root'
})

/**
 * La clase GenotypeTypesService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class GenotypeTypesService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/genotype_type) y el tipo que debe devolver (GenotypeType)
   * @returns Promise<AxiosResponse<Array<GenotypeType>>>
   */
  fetch(): Promise<AxiosResponse<Array<GenotypeType>>> {
    return this.getFetchService.fetch<undefined, Array<GenotypeType>>('/genotype_type');
  }
}
