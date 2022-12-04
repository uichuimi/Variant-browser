import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ICreatable } from "../../../interfaces/ICreatable";
@Injectable({
  providedIn: 'root'
})

/**
 * La clase CreateService se encarga de
 * hacer las llamadas tipo POST a la API
 */
export class CreateService implements ICreatable {
  private httpHandler: AxiosInstance;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  /**
   *
   * @param endpoint punto de la API al que ataca
   * @param data datos que van en el body de la llamada
   * @returns Promise<AxiosResponse<U>> (Promesa genérica)
   */
  create<T, U>(endpoint: string, data: T): Promise<AxiosResponse<U>> {
    return this.httpHandler.post<U>(endpoint, data);
  }
}
