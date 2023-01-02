import { Inject, Injectable } from "@angular/core";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { GetFetchService } from "../fetch-service/get-fetch-service/get-fetch.service";
import { Biotype } from "../../models/response/Biotype";

@Injectable({
  providedIn: "root"
})

/**
 * La clase BiotypeService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class BiotypesService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/biotypes) y el tipo que debe devolver (Biotype)
   * @returns Promise<AxiosResponse<Array<Biotype>>>
   */
  fetch(): Promise<AxiosResponse<Array<Biotype>>> {
    return this.getFetchService.fetch<undefined, Array<Biotype>>("/biotypes");
  }
}
