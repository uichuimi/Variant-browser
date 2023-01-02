import { VarcanService } from "./varcan.service";
import { environment } from "../../../../environments/environment";

// MODELS
import { Login } from "./models/request/Login";
import { ResponseStatus } from "./models/response/ResponseStatus";
import { Biotype } from "./models/response/Biotype";
import { Chromosome } from "./models/response/Chromosome";
import { Impact } from "./models/response/Impact";
import { GenotypeType } from "./models/response/GenotypeType";
import { Individual } from "./models/response/Individual";
import { Effect } from "./models/response/Effect";
import { Population } from "./models/response/Population";
import { GeneQueryParams } from "./models/request/gene-query-params";
import { Gene } from "./models/response/Gene";
import { Token } from "./models/response/Token";
import { Page } from "./models/response/Page";
// VARIANT

// Inputs and outputs mockups
// LOGIN
const loginCorrectMockup: Login = require("../../../../fixtures/varcanService/login/request/loginCorrectMockup.json");
const loginIncorrectMockup: ResponseStatus = require("../../../../fixtures/varcanService/login/request/loginIncorrectMockup.json");
const loginIncorrectOutputMockup: ResponseStatus = require("../../../../fixtures/varcanService/login/response/loginIncorrectOutputMockup.json");

// BIOTYPES
const biotypeOutputMockup: Array<Biotype> = require("../../../../fixtures/varcanService/biotype/response/biotypeOutputMockup.json");

// CHROMOSOMES
const chromosomeOutputMockup: Array<Chromosome> = require("../../../../fixtures/varcanService/chromosome/response/chromosomeOutputMockup.json");

// IMPACTS
const impactOutputMockup: Array<Impact> = require("../../../../fixtures/varcanService/impact/response/impactOutputMockup.json");

// GENOTYPE_TYPE
const genotypeTypeOutputMockup: Array<GenotypeType> = require("../../../../fixtures/varcanService/genotypeType/response/genotypeTypeOutputMockup.json");

// INDIVIDUALS
const individualOutputMockup: Array<Individual> = require("../../../../fixtures/varcanService/individual/response/individualOutputMockup.json");

// EFFECTS
const effectOutputMockup: Array<Effect> = require("../../../../fixtures/varcanService/effect/response/effectOutputMockup.json");

// POPULATIONS
const populationsAscOutputMockup: Array<Population> = require("../../../../fixtures/varcanService/population/response/populationsAscOutputMockup.json");
const populationsDescOutputMockup: Array<Population> = require("../../../../fixtures/varcanService/population/response/populationsDescOutputMockup.json");

// GENES
const geneSingleParameterInputMockup: GeneQueryParams = require("../../../../fixtures/varcanService/gene/request/geneSingleParameterInputMockup.json");
const geneMultipleParametersInputMockup: GeneQueryParams = require("../../../../fixtures/varcanService/gene/request/geneMutipleParametersInputMockup.json");
const geneOutputMockup: Array<Gene> = require("../../../../fixtures/varcanService/gene/response/geneOutputMockup.json");
const geneFilteredOutputMockup: Array<Gene> = require("../../../../fixtures/varcanService/gene/response/geneFilteredOutputMockup.json");

describe("VarCanService", () => {
  let service: VarcanService;

  beforeEach(() => {
    service = new VarcanService(environment.serverUrl);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return a valid token when correct credentials are being passed to /login endpoint", () => {
    service.login(loginCorrectMockup).then(response => {
      const loginApi: Token = response;
      expect(loginApi.access_token)
        .toBeTruthy();
      expect(loginApi.refresh_token)
        .toBeTruthy();
      expect(loginApi.expires_in)
        .toBeTruthy();
      expect(loginApi.token_type)
        .toBe("bearer");
    });
  });

  /*it("should return a failed status when incorrect credentials are being passed to /login endpoint", () => {
    const loginModel: Login = loginIncorrectMockup;
    const status: ResponseStatus = loginIncorrectOutputMockup;

    expect(service.login(loginModel))
      .withContext("service return status failed")
      .toBe(status);
  });*/

  it("should return a biotypes list when a call is made to /biotypes endpoint", () => {
    service.getBiotypes().then(response => {
      const biotypesApi: Array<Biotype> = response.data;
      expect(biotypesApi)
        .toEqual(biotypeOutputMockup);
    });
  });

  it("should return a chromosomes list when a call is made to /chromosomes endpoint", () => {
    service.getChromosomes().then(response => {
      const chromosomesApi: Array<Chromosome> = response.data;
      expect(chromosomesApi)
        .toEqual(chromosomeOutputMockup);
    });
  });

  it("should return an impacts list when a call is made to /impacts endpoint", () => {
    service.getImpacts().then(response => {
      const impactsApi: Array<Impact> = response.data;
      expect(impactsApi)
        .toEqual(impactOutputMockup);
    });
  });

  it("should return a genotype_types list when a call is made to /genotype_type endpoint", () => {
    service.getGenotypeTypes().then(response => {
      const genotypeTypesApi: Array<GenotypeType> = response.data;
      expect(genotypeTypesApi)
        .toEqual(genotypeTypeOutputMockup);
    });
  });

  it("should return an individuals list when a call is made to /individuals endpoint", () => {
    service.getIndividuals().then(response => {
      const individualsApi: Array<Individual> = response.data;
      expect(individualsApi)
        .toEqual(individualOutputMockup);
    });
  });

  it("should return an effects list when a call is made to /effects endpoint", () => {
    service.getEffects().then(response => {
      const effectsApi: Array<Effect> = response.data;
      expect(effectsApi)
        .toEqual(effectOutputMockup);
    });
  });

  it("should return a populations ascending sorted list when a call is made to /populations endpoint", () => {
    service.getPopulations().then(response => {
      const populationsApi: Array<Population> = response.data;
      expect(populationsApi)
        .toEqual(populationsAscOutputMockup);
      expect(populationsApi[0].id)
        .toBe(1);
      expect(populationsApi[populationsApi.length - 1].id)
        .toBe(12);
    });
  });

  it("should return a populations descending sorted list when a call is made to /populations endpoint", () => {
    service.getPopulations("id,desc").then(response => {
      const populationsApi: Array<Population> = response.data;
      expect(populationsApi)
        .toEqual(populationsDescOutputMockup);
      expect(populationsApi[0].id)
        .toBe(12);
      expect(populationsApi[populationsApi.length - 1].id)
        .toBe(1);
    });
  });

  it("should return a page of genes when no parameters are set in /genes endpoint", () => {
    service.getGenes().then(response => {
      const genesApi: Page<Gene> = response.data;
      expect(genesApi.content)
        .toEqual(geneOutputMockup);
      expect(genesApi.totalElements)
        .toBe(21085);
      expect(genesApi.totalPages)
        .toBe(1055);
    });
  });

  it("should return a page of genes filtered by query when a parameter is set in /genes endpoint", () => {
    service.getGenes(geneSingleParameterInputMockup).then(response => {
      const genesApi: Page<Gene> = response.data;
      expect(genesApi.content)
        .toEqual(geneFilteredOutputMockup);
      expect(genesApi.totalElements)
        .toBe(1);
      expect(genesApi.totalPages)
        .toBe(1);
    });
  });

  it("should return a page of genes filtered by query when all parameters are set in /genes endpoint", () => {
    service.getGenes(geneMultipleParametersInputMockup).then(response => {
      const genesApi: Page<Gene> = response.data;
      expect(genesApi.content)
        .toEqual(geneFilteredOutputMockup);
      expect(genesApi.totalElements)
        .toBe(1);
      expect(genesApi.totalPages)
        .toBe(1);
    });
  });

  // ToDo: esperar a que endpoint /variant-line esté hecho

  /*it("should return a page of variants when no parameters are set in /variants endpoint", () => {
    // const predictedResult: Array<Variant> = ;

    const result = service.getVariant(variantModel);

    /*expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(predictedResult);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(1);
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1);
  });*/

  /*it("should return a page of variants filtered by query when a parameter is set in /variants endpoint", () => {
    const variantModel: VariantParams = variantSingleParamOutputMockup;
    // const predictedResult: Array<Variant> = ;

    const result = service.getVariant(variantModel);

    /*expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(predictedResult);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(1);
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1);
  });

  it("should return a page of variants filtered by query when all parameters are set in /variants endpoint", () => {
    const variantModel: VariantParams = variantMultipleParamsOutputMockup;
    // const predictedResult: Array<Variant> = ;

    const result = service.getVariant(variantModel);

    /*expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(predictedResult);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(1);
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1);
  });  */
});
