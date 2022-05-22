import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root'
})

/**
 * La clase PostFetchService se encarga de hacer una llamada 
 * tipo GET a la API especial y específica para el login y variants
 */
export class PostFetchService extends FetchService {

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    super(httpHandler);
  }

  /**
   * 
   * @param endpoint punto de la API al que ataca
   * @param data datos que van en el body de la llamada
   * @param query datos que van en la query string de la llamada 
   * @returns Promise<AxiosResponse<U>> (Promesa genérica)
   */
  fetch<T, U>(endpoint: string, data?: T, query?: object): Promise<AxiosResponse<U>> {
    return this.httpHandler.get<U>(endpoint, data);  
  }  
}
