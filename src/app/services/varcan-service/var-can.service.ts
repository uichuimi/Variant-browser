import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { ApiService } from '../api.service';
import { ChromosomesService } from './chromosome-service/chromosomes.service';

import { Chromosome } from 'src/app/models/Chromosome';
import { Biotype } from 'src/app/models/Biotype';
import { BiotypesService } from './biotype-service/biotypes.service';

@Injectable({
  providedIn: 'root'
})
export class VarCanService extends ApiService {
  private httpHandler: AxiosInstance;
  private chromosomeService: ChromosomesService;
  private biotypeService: BiotypesService;

  constructor(serverUrl: string) {
    super(serverUrl);
    this.httpHandler = axios.create({
      baseURL: serverUrl,
      timeout: 2000
    })
    this.chromosomeService = new ChromosomesService(this.httpHandler);
    this.biotypeService = new BiotypesService(this.httpHandler);
  }

  getChromosomes(): Array<Chromosome> {
    return this.chromosomeService.fetch();
  }

  getBiotypes(): Array<Biotype> {
    return this.biotypeService.fetch();
  }
}
