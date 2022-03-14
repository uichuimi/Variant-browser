import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';

import * as chromosomeOutputMockup from 'fixtures/varcanService/chromosome/output/chromosomeOutputMockup.json';
import { Chromosome } from 'src/app/models/Chromosome';

@Injectable({
  providedIn: 'root'
})
export class ChromosomesService {
  readonly httpHandler: AxiosInstance;

  constructor(httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<Chromosome> {
    let pruebaArray: Array<Chromosome> = chromosomeOutputMockup.chromosomes;
    return pruebaArray;    
  }
}
