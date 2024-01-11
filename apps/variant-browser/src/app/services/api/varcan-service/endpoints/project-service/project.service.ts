import {Inject, Injectable} from '@angular/core';
import axios, {AxiosInstance, AxiosResponse} from 'axios';

import {GetFetchService} from '../fetch-service/get-fetch-service/get-fetch.service';
import {Project} from "../../models/response/Project";

@Injectable({
  providedIn: 'root'
})

/**
 * La clase ProjectService se encarga de instanciar a GetFetchService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class ProjectService {
  readonly httpHandler: AxiosInstance;
  readonly getFetchService: GetFetchService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.getFetchService = new GetFetchService(this.httpHandler);
  }

  /**
   * Usa el método fetch de GetFetchService, especificando el punto
   * de ataque (/projects) y el tipo que debe devolver (Project)
   * @returns Promise<AxiosResponse<Array<Project>>>
   */
  fetch(): Promise<AxiosResponse<Array<Project>>> {
    return this.getFetchService.fetch<undefined, Array<Project>>('/projects');
  }
}
