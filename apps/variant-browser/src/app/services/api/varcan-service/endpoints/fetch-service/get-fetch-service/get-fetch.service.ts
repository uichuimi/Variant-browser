import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root'
})

/**
 * La clase GetFecthService se encarga de
 * hacer las llamadas de tipo GET a la API
 */
export class GetFetchService extends FetchService {

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    super(httpHandler);
  }

  /**
   * Se encarga de hacer la llamada a la API
   * @param endpoint punto de la API al que ataca
   * @param data datos que van en el body de la llamada
   * @param query datos que van en la query string de la llamada
   * @returns Promise<AxiosResponse<U>> (Promesa genérica)
   */
  fetch<T, U>(endpoint: string, data?: T, query?: object): Promise<AxiosResponse<U>> {
    if (typeof query !== 'undefined') {
      return this.httpHandler.get<U>(endpoint, { params: query });
    } else {
      return this.httpHandler.get<U>(endpoint);
    }
  }
}