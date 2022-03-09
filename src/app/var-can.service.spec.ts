import { VarCanService } from './var-can.service';

// Inputs and outputs mockups
// LOGIN
import * as loginCorrectMockup from '../fixtures/varcanService/login/input/loginCorrectMockup.json';
import * as loginIncorrectMockup from '../fixtures/varcanService/login/input/loginIncorrectMockup.json';
import * as loginIncorrectOutputMockup from '../fixtures/varcanService/login/output/loginIncorrectOutputMockup.json';

// BIOTYPES
import * as biotypeOutputMockup from '../fixtures/varcanService/biotype/output/biotypeOutputMockup.json';

// CHROMOSOMES
import * as chromosomeOutputMockup from '../fixtures/varcanService/chromosome/output/chromosomeOutputMockup.json';

// IMPACTS
import * as impactOutputMockup from '../fixtures/varcanService/impact/output/impactOutputMockup.json';

// GENOTYPE_TYPE
import * as genotypeTypeOutputMockup from '../fixtures/varcanService/genotypeType/output/genotypeTypeOutputMockup.json';

// INDIVIDUALS
import * as individualOutputMockup from '../fixtures/varcanService/individual/output/individualOutputMockup.json';

// EFFECTS
import * as effectOutputMockup from '../fixtures/varcanService/effect/output/effectOutputMockup.json';

// POPULATIONS
import * as populationOutputMockup from '../fixtures/varcanService/population/output/populationOutputMockup.json';

// GENES
import * as geneSingleParameterInputMockup from '../fixtures/varcanService/gene/input/geneSingleParameterInputMockup.json';
import * as geneMultipleParametersInputMockup from '../fixtures/varcanService/gene/input/geneMutipleParametersInputMockup.json';
import * as geneOutputMockup from '../fixtures/varcanService/gene/output/geneOutputMockup.json';
import * as geneFilteredOutputMockup from '../fixtures/varcanService/gene/output/geneFilteredOutputMockup.json';

describe('VarCanService', () => {
  let service: VarCanService;

  beforeEach(() => {
    service = new VarCanService();  // falta pasarle URL o AxiosInstance
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return token: <Token> (/login)", () => {
    const loginModel: Login = loginCorrectMockup;
    const result: Token = service.login(loginModel);
    
    expect(result['access_token'])
      .withContext("service returned access_token")
      .toBeTruthy()
    expect(result['refresh_token'])
      .withContext("service returned refresh_token")
      .toBeTruthy();
    expect(result['expires_in'])
      .withContext("service returned expires_in")
      .toBeTruthy();
    expect(result['token_type'])
      .withContext("service returned token_type")
      .toBe('bearer');
  });

  it("should return status: failed (/login)", () => {
    const loginModel: Login = loginIncorrectMockup;
    const status: ResponseStatus = loginIncorrectOutputMockup;

    expect(service.login(loginModel))
      .withContext("service return status failed")
      .toBe(status);
  });

  it("should return Array<Biotype> (/biotypes)", () => {
    const result: Array<Biotype> = biotypeOutputMockup.biotypes;

    expect(service.getBiotypes())
      .withContext("service return Array<Biotype>")
      .toBe(result);
  });

  it("should return Array<Chromosome> (/chromosomes)", () => {
    const result: Array<Chromosome> = chromosomeOutputMockup.chromosomes;

    expect(service.getChromosomes())
      .withContext("service return Array<Chromosome>")
      .toBe(result);
  });

  it("should return Array<Impact> (/impacts)", () => {
    const result: Array<Impact> = impactOutputMockup.impacts;

    expect(service.getImpacts())
      .withContext("service return Array<Impact>")
      .toBe(result);
  }); 
  
  it("should return Array<GenotypeType> (/genotype_type)", () => {
    const result: Array<GenotypeType> = genotypeTypeOutputMockup.genotypeType;

    expect(service.getGenotypeType())
      .withContext("service return Array<GenotypeType>")
      .toBe(result);
  });    

  it("should return Array<Individual> (/individuals)", () => {
    const result: Array<Individual> = individualOutputMockup.individuals;

    expect(service.getIndividuals())
      .withContext("service return Array<Individual>")
      .toBe(result);
  });   

  it("should return Array<Effect> (/effects)", () => {
    const result: Array<Effect> = effectOutputMockup.effects;

    expect(service.getEffects())
      .withContext("service return Array<Individual>")
      .toBe(result);
  }); 
  
  it("should return Array<Population> (/populations)", () => {
    const result: Array<Population> = populationOutputMockup.populations;

    expect(service.getPopulations())
      .withContext("service return Array<Population>")
      .toBe(result);
    expect(result[0].id)
      .withContext("first Population must have id 1")
      .toBe(1);
    expect(result[result.length-1].id)
      .withContext("last Population must have id 12")
      .toBe(12);
  });  
  
  it("should return Page<Gene> (/genes)", () => {
    const resultContent: Array<Gene> = geneOutputMockup.genes;

    const result = service.getGenes();

    expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(resultContent);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(21085);  
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1055);              
  });  

  it("should return Page<Gene> filtered by query (/genes)", () => {
    const geneModel: GeneParams = geneSingleParameterInputMockup;
    const resultContent: Array<Gene> = geneFilteredOutputMockup.genes;

    const result = service.getGenes(geneModel);

    expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(resultContent);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(1);  
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1);              
  });  

  it("should return Page<Gene> filtered by query (/genes)", () => {
    const geneModel: GeneParams = geneMultipleParametersInputMockup;
    const resultContent: Array<Gene> = geneFilteredOutputMockup.genes;

    const result = service.getGenes(geneModel);

    expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(resultContent);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(1);  
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1);              
  });   
});
