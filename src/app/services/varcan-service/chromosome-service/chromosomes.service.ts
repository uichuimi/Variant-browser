import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';

import * as chromosomeOutputMockup from 'fixtures/varcanService/chromosome/output/chromosomeOutputMockup.json';
import { Chromosome } from 'src/app/models/Chromosome';

@Injectable({
  providedIn: 'root'
})
export class ChromosomesService {

  constructor(private httpHandler: AxiosInstance) { }

  fetch(): Array<Chromosome> {
    let pruebaArray: Array<Chromosome> = chromosomeOutputMockup.chromosomes;
    return pruebaArray;    
  }
}
