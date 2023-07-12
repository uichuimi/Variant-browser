import { Injectable, Inject } from '@angular/core';
import axios, {AxiosInstance, AxiosResponse} from 'axios';
import { ApiService } from '../api.service';
import { ChromosomesService } from './endpoints/chromosome-service/chromosomes.service';
import { BiotypesService } from './endpoints/biotype-service/biotypes.service';
import { GenesService } from './endpoints/genes-service/genes.service';
import { ImpactsService } from './endpoints/impacts-service/impacts.service';
import { EffectsService } from './endpoints/effects-service/effects.service';
import { PopulationsService } from './endpoints/populations-service/populations.service';
import { GenotypeTypesService } from './endpoints/genotype-types-service/genotype-types.service';
import { VariantsService } from './endpoints/variants-service/variants.service';
import { IndividualsService } from './endpoints/individuals-service/individuals.service';
import { LoginService } from './endpoints/login-service/login.service';
import { RegisterService } from './endpoints/register-service/register.service';
import { TokenStorageService } from './endpoints/token-storage-service/token-storage.service';
import { BatchGeneService } from './endpoints/batch-gene-service/batch-gene.service';
import { environment } from "../../../../environments/environment";
import { Login } from "./models/request/login";
import { Token } from "./models/response/Token";
import { Register } from "./models/request/register";
import { ResponseStatus } from "./models/response/ResponseStatus";
import { Chromosome } from "./models/response/Chromosome";
import { Biotype } from "./models/response/Biotype";
import { GeneQueryParams } from "./models/request/gene-query-params";
import { Page } from "./models/response/Page";
import { Gene } from "./models/response/Gene";
import { Impact } from "./models/response/Impact";
import { Effect } from "./models/response/Effect";
import { Population } from "./models/response/Population";
import { GenotypeType } from "./models/response/GenotypeType";
import { Individual } from "./models/response/Individual";
import { VariantParams } from "./models/request/variant-params";
import { CsvVariantReportParams } from "./models/request/csv-variant-report-params";
import { Variant } from "./models/response/Variant";
import { DownloadCsvReportService } from "./endpoints/download-csv-report-service/download.csv.report.service";

@Injectable({
  providedIn: 'root'
})

/**
 * La clase VarcanService es el servicio que se
 * encarga de instanciar a todos los demás (patrón Singleton)
 */
export class VarcanService extends ApiService {
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
  private downloadCsvReportService: DownloadCsvReportService;

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
    this.downloadCsvReportService = new DownloadCsvReportService(this.httpHandler);
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
   * Recupera la cookie de sesión cada vez que se refresca una página de restringida
   * @returns void
   */
  refreshLogin(): void {
    const token: Token = this.tokenStorageService.getToken();
    this.tokenStorageService.saveToken(this.httpHandler, token);
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
   * Cierra la sesión eliminando todos las cookies de sesión
   * @returns void
   */
  logout(): void {
    this.tokenStorageService.signout();
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

  downloadCsvReport(data?: CsvVariantReportParams): Promise<AxiosResponse<string>> {
    return data !== null ? this.downloadCsvReportService.fetch(data) : this.downloadCsvReportService.fetch();
  }
}
