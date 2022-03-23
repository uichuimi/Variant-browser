import { Injectable, Inject } from '@angular/core';
import axios, {AxiosInstance, AxiosResponse} from 'axios';

// SERVICES
import { ApiService } from '../api.service';
import { ChromosomesService } from './chromosome-service/chromosomes.service';
import { BiotypesService } from './biotype-service/biotypes.service';
import { GenesService } from './genes-service/genes.service';
import { ImpactsService } from './impacts-service/impacts.service';
import { EffectsService } from './effects-service/effects.service';
import { PopulationsService } from './populations-service/populations.service';
import { GenotypeTypesService } from './genotypeTypes-service/genotype-types.service';
import { VariantsService } from './variants-service/variants.service';
import { IndividualsService } from './individuals-service/individuals.service';
import { LoginService } from './login-service/login.service';

// MODELS
import { Chromosome } from 'src/app/models/output/Chromosome';
import { Biotype } from 'src/app/models/output/Biotype';
import { Gene } from 'src/app/models/output/Gene';
import { Page } from 'src/app/models/output/Page';
import { GeneParams } from 'src/app/models/input/GeneParams';
import { Impact } from 'src/app/models/output/Impact';
import { Effect } from 'src/app/models/output/Effect';
import { Population } from 'src/app/models/output/Population';
import { GenotypeType } from 'src/app/models/output/GenotypeType';
import { Individual } from 'src/app/models/output/Individual';
import { VariantParams } from 'src/app/models/input/VariantParams';
import { Variant } from 'src/app/models/output/Variant';
import { Login } from 'src/app/models/input/Login';
import { Token } from 'src/app/models/output/Token';

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
  private populationService: PopulationsService;
  private genotypeTypeService: GenotypeTypesService;
  private individualService: IndividualsService;
  private variantService: VariantsService;
  private loginService: LoginService;

  constructor(@Inject(String) serverUrl: string) {
    super(serverUrl);
    this.httpHandler = axios.create({
      baseURL: this.url,
      timeout: 2000,
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1aWNodWltaSIsImV4cCI6MTY0ODEwODk1NiwiaWF0IjoxNjQ4MDcyOTU2fQ.yO5tO_OQiq-8h59gsuw43Bkd1gwqg7HCGGbFX1VzmvSBBGPnhjhI8ENp-yPwUdVISZuPDmOj51iHR-Nl9KOeRA'
      }
    });
    this.chromosomeService = new ChromosomesService(this.httpHandler);
    this.biotypeService = new BiotypesService(this.httpHandler);
    this.geneService = new GenesService(this.httpHandler);
    this.impactService = new ImpactsService(this.httpHandler);
    this.effectService = new EffectsService(this.httpHandler);
    this.populationService = new PopulationsService(this.httpHandler);
    this.genotypeTypeService = new GenotypeTypesService(this.httpHandler);
    this.individualService = new IndividualsService(this.httpHandler);
    this.variantService = new VariantsService(this.httpHandler);
    this.loginService = new LoginService(this.httpHandler);
  }

  login(data: Login): Token {
    return this.loginService.fetch(data);
  }

  getChromosomes(): Promise<AxiosResponse<Array<Chromosome>>> {
    return this.chromosomeService.fetch();
  }

  getBiotypes(): Promise<AxiosResponse<Array<Biotype>>> {
    return this.biotypeService.fetch();
  }

  getGenes(query?: GeneParams): Promise<AxiosResponse<Page<Gene>>> {
    return query !== null ? this.geneService.fetch(query) : this.geneService.fetch();
  }

  getImpacts(): Promise<AxiosResponse<Array<Impact>>> {
    return this.impactService.fetch();
  }

  getEffects(): Promise<AxiosResponse<Array<Effect>>> {
    return this.effectService.fetch();
  }

  getPopulations(sort?: string): Array<Population> {
    return sort !== null ? this.populationService.fetch(sort) : this.populationService.fetch();
  }

  getGenotypeTypes(): Promise<AxiosResponse<Array<GenotypeType>>> {
    return this.genotypeTypeService.fetch();
  }

  getIndividuals(): Promise<AxiosResponse<Array<Individual>>> {
    return this.individualService.fetch();
  }

  getVariants(data?: VariantParams): Page<Variant> {
    return data !== null ? this.variantService.fetch(data) : this.variantService.fetch();
  }
}
