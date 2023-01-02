import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { CreateService } from '../create-service/create.service';
import { Register } from "../../models/request/Register";
import { ResponseStatus } from "../../models/response/ResponseStatus";

@Injectable({
  providedIn: 'root'
})

/**
 * La clase RegisterService se encarga de instanciar a CreateService,
 * especificando el punto de ataque y el tipo que debe devolver
 */
export class RegisterService {
  readonly httpHandler: AxiosInstance;
  readonly createService: CreateService;

  constructor(@Inject(axios) httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
    this.createService = new CreateService(this.httpHandler);
  }

  create(data: Register): Promise<AxiosResponse<ResponseStatus>> {
    return this.createService.create<Register,ResponseStatus>('/register', data);
  }
}
