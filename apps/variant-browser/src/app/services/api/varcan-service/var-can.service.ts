import { Injectable, Inject } from '@angular/core';
import axios, {AxiosInstance, AxiosResponse} from 'axios';
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
import { RegisterService } from './register-service/register.service';
import { TokenStorageService } from './tokenStorage-service/token-storage.service';
import { BatchGeneService } from './batchGene-service/batch-gene.service';
import {environment} from "../../../../environments/environment";
import { Login } from "../../../models/input/Login";
import { Token } from "../../../models/output/Token";
import { Register } from "../../../models/input/Register";
import { ResponseStatus } from "../../../models/output/ResponseStatus";
import { Chromosome } from "../../../models/output/Chromosome";
import { Biotype } from "../../../models/output/Biotype";
import { GeneQueryParams } from "../../../models/input/GeneQueryParams";
import { Page } from "../../../models/output/Page";
import { Gene } from "../../../models/output/Gene";
import { Impact } from "../../../models/output/Impact";
import { Effect } from "../../../models/output/Effect";
import { Population } from "../../../models/output/Population";
import { GenotypeType } from "../../../models/output/GenotypeType";
import { Individual } from "../../../models/output/Individual";
import { VariantParams } from "../../../models/input/VariantParams";
import { Variant } from "../../../models/output/Variant";

@Injectable({
  providedIn: 'root'
})

/**
 * La clase VarCanService es el servicio que se
 * encarga de instanciar a todos los demás (patrón Singleton)
 */
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
  private registerService: RegisterService;
  private tokenStorageService: TokenStorageService;
  private batchGeneService: BatchGeneService;

  constructor(@Inject('environment') serverUrl: string) {
    super(serverUrl);
    this.tokenStorageService = new TokenStorageService();
    this.httpHandler = axios.create({
      baseURL: this.url,
      timeout: 2000
    });
    this.loginService = new LoginService(this.httpHandler);

    this.chromosomeService = new ChromosomesService(this.httpHandler);
    this.biotypeService = new BiotypesService(this.httpHandler);
    this.geneService = new GenesService(this.httpHandler);
    this.impactService = new ImpactsService(this.httpHandler);
    this.effectService = new EffectsService(this.httpHandler);
    this.populationService = new PopulationsService(this.httpHandler);
    this.genotypeTypeService = new GenotypeTypesService(this.httpHandler);
    this.individualService = new IndividualsService(this.httpHandler);
    this.variantService = new VariantsService(this.httpHandler);
    this.registerService = new RegisterService(this.httpHandler);
    this.batchGeneService = new BatchGeneService(this.httpHandler);
  }

  /**
   * Se encarga de crear una promesa que cuando se abra logueará al usuario
   * @param data modelo de entrada de Login (username y password)
   * @returns Promise<AxiosResponse<Token>>
   */

  login(data: Login): Promise<Token> {
    return this.loginService.fetch(data).then(response => {
      this.tokenStorageService.saveToken(this.httpHandler, response.data);
      return response.data;
    });
  }

  /**
   * Se encarga de crear una promesa que cuando se abra registrará a un usuario
   * @param data modelo de entrada de Register (username y password)
   * @returns Promise<AxiosResponse<ResponseStatus>>
   */

  register(data: Register): Promise<AxiosResponse<ResponseStatus>> {
    return this.registerService.create(data);
  }

  /**
   * Se encarga de crear una promesa que cuando
   * se abra devolverá un listado de cromosomas
   * @returns Promise<AxiosResponse<Array<Chromosome>>>
   */
  getChromosomes(): Promise<AxiosResponse<Array<Chromosome>>> {
    return this.chromosomeService.fetch();
  }

  /**
   * Se encarga de crear una promesa que cuando
   * se abra devolverá un listado de biotipos
   * @returns Promise<AxiosResponse<Array<Biotype>>>
   */
  getBiotypes(): Promise<AxiosResponse<Array<Biotype>>> {
    return this.biotypeService.fetch();
  }

  /**
   * Se encarga de crear una promesa que cuando
   * se abra devolverá un listado paginado de genes
   * @param query modelo de entrada de GeneQueryParams
   * @returns Promise<AxiosResponse<Page<Gene>>>
   */
  getGenes(query?: GeneQueryParams): Promise<AxiosResponse<Page<Gene>>> {
    return query !== null ? this.geneService.fetch(query) : this.geneService.fetch();
  }

  /**
   * Se encarga de crear una promesa que cuando
   * se abra devolverá un listado de impactos
   * @returns Promise<AxiosResponse<Array<Impact>>>
   */
  getImpacts(): Promise<AxiosResponse<Array<Impact>>> {
    return this.impactService.fetch();
  }

  /**
   * Se encarga de crear una promesa que cuando
   * se abra devolverá un listado de efectos
   * @returns Promise<AxiosResponse<Array<Effect>>>
   */
  getEffects(): Promise<AxiosResponse<Array<Effect>>> {
    return this.effectService.fetch();
  }

  /**
   * Se encarga de crear una promesa que cuando
   * se abra devolverá un listado de poblaciones
   * @param sort indica si se quiere el listado
   * ordenado de forma ascendente o descendente
   * @returns Promise<AxiosResponse<Array<Population>>>
   */
  getPopulations(sort?: string): Promise<AxiosResponse<Array<Population>>> {
    return sort !== null ? this.populationService.fetch(sort) : this.populationService.fetch();
  }

  /**
   * Se encarga de crear una promesa que cuando se
   * abra devolverá un listado de tipos de genotipos
   * @returns Promise<AxiosResponse<Array<GenotypeType>>>
   */
  getGenotypeTypes(): Promise<AxiosResponse<Array<GenotypeType>>> {
    return this.genotypeTypeService.fetch();
  }

  /**
   * Se encarga de crear una promesa que cuando
   * se abra devolverá un listado de individuos
   * @returns Promise<AxiosResponse<Array<Individual>>>
   */
  getIndividuals(): Promise<AxiosResponse<Array<Individual>>> {
    return this.individualService.fetch();
  }

  /**
   * Se encarga de crear una promesa que cuando se
   * abra devolverá un listado paginado de variantes
   * @param data modelo de entrada de VariantParams
   * @returns Page<Variant>
   */
  getVariants(data?: VariantParams): Promise<AxiosResponse<Page<Variant>>> {
    return data !== null ? this.variantService.fetch(data) : this.variantService.fetch();
  }

  getBatchGenes(data?): Promise<AxiosResponse<Array<Gene>>> {
    return data !== null ? this.batchGeneService.fetch(data) : this.batchGeneService.fetch();
  }
}
