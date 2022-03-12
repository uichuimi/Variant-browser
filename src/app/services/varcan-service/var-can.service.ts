import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { ApiService } from '../api.service';
import { ChromosomesService } from './chromosome-service/chromosomes.service';

import { Chromosome } from 'src/app/models/Chromosome';

@Injectable({
  providedIn: 'root'
})
export class VarCanService extends ApiService {
  private httpHandler: AxiosInstance;
  private chromosomeService: ChromosomesService;

  constructor(serverUrl: string) {
    super(serverUrl);
    this.httpHandler = axios.create({
      baseURL: serverUrl,
      timeout: 2000
    })
    this.chromosomeService = new ChromosomesService(this.httpHandler);
  }

  getChromosomes(): Array<Chromosome> {
    return this.chromosomeService.fetch();
  }
}
