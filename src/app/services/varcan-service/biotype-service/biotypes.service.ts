import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';

import * as biotypeOutputMockup from 'fixtures/varcanService/biotype/output/biotypeOutputMockup.json';
import { Biotype } from 'src/app/models/Biotype';

@Injectable({
  providedIn: 'root'
})
export class BiotypesService {
  readonly httpHandler: AxiosInstance;

  constructor(httpHandler: AxiosInstance) {
    this.httpHandler = httpHandler;
  }

  fetch(): Array<Biotype> {
    let pruebaArray: Array<Biotype> = biotypeOutputMockup.biotypes;
    return pruebaArray;    
  }  
}
