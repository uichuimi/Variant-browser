import { Injectable, Inject } from '@angular/core';
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

  constructor(@Inject(String) serverUrl: string) {
    super(serverUrl);
    this.httpHandler = axios.create({
      baseURL: "http://localhost:8080",
      timeout: 2000,
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1aWNodWltaSIsImV4cCI6MTY0NzgzOTMxNywiaWF0IjoxNjQ3ODAzMzE3fQ.ItuOw5o0-TnIx2d_Mw7LKfbJpuVs_td66n65UeLYu2Oy5Zgaa12baiPnCmNaS5Mkc6yVKADcEfeYBPAJbllDgA' }
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
