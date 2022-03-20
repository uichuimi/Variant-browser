import { Injectable, Inject } from '@angular/core';
import axios, { AxiosInstance } from 'axios';

// SERVICES
import { ApiService } from '../api.service';
import { ChromosomesService } from './chromosome-service/chromosomes.service';
import { BiotypesService } from './biotype-service/biotypes.service';
import { GenesService } from './genes-service/genes.service';
import { ImpactsService } from './impacts-service/impacts.service';
import { EffectsService } from './effects-service/effects.service';

// MODELS
import { Chromosome } from 'src/app/models/output/Chromosome';
import { Biotype } from 'src/app/models/output/Biotype';
import { Gene } from 'src/app/models/output/Gene';
import { Page } from 'src/app/models/output/Page';
import { GeneParams } from 'src/app/models/input/GeneParams';
import { Impact } from 'src/app/models/output/Impact';
import { Effect } from 'src/app/models/output/Effect';

@Injectable({
  providedIn: 'root'
})
export class VarCanService extends ApiService {
  private httpHandler: AxiosInstance;
  private chromosomeService: ChromosomesService;
  private biotypeService: BiotypesService;
  private geneService: GenesService;
  private impactService: ImpactsService;
  private effectService: EffectsService;

  constructor(@Inject(String) serverUrl: string) {
    super(serverUrl);
    this.httpHandler = axios.create({
      baseURL: "http://localhost:8080",
      timeout: 2000,
      headers: { Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1aWNodWltaSIsImV4cCI6MTY0Nzg0MjQzOCwiaWF0IjoxNjQ3ODA2NDM4fQ.86Eyn3eR6H2fnub7xgHylivzcCMvT4B1gion254TtbTySKmHcnqYt6iC1BR3ILN5rQYO1wR3pGh6aoo3ImivlA' }
    })
    this.chromosomeService = new ChromosomesService(this.httpHandler);
    this.biotypeService = new BiotypesService(this.httpHandler);
    this.geneService = new GenesService(this.httpHandler);
    this.impactService = new ImpactsService(this.httpHandler);
  }

  getChromosomes(): Array<Chromosome> {
    return this.chromosomeService.fetch();
  }

  getBiotypes(): Array<Biotype> {
    return this.biotypeService.fetch();
  }

  getGenes(query?: GeneParams): Page<Gene> {
    return this.geneService.fetch(query);
  }  

  getImpacts(): Array<Impact> {
    return this.impactService.fetch();
  } 

  getEffects(): Array<Effect> {
    return this.effectService.fetch();
  }    
}
