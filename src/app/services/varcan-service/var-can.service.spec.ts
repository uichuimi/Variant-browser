import { VarCanService } from './var-can.service';
import { environment } from 'src/environments/environment';

// Inputs and outputs mockups
// LOGIN
import * as loginCorrectMockup from 'fixtures/varcanService/login/input/loginCorrectMockup.json'
import * as loginIncorrectMockup from 'fixtures/varcanService/login/input/loginIncorrectMockup.json';
import * as loginIncorrectOutputMockup from 'fixtures/varcanService/login/output/loginIncorrectOutputMockup.json';

// BIOTYPES
import * as biotypeOutputMockup from 'fixtures/varcanService/biotype/output/biotypeOutputMockup.json';

// CHROMOSOMES
import * as chromosomeOutputMockup from 'fixtures/varcanService/chromosome/output/chromosomeOutputMockup.json';

// IMPACTS
import * as impactOutputMockup from 'fixtures/varcanService/impact/output/impactOutputMockup.json';

// GENOTYPE_TYPE
import * as genotypeTypeOutputMockup from 'fixtures/varcanService/genotypeType/output/genotypeTypeOutputMockup.json';

// INDIVIDUALS
import * as individualOutputMockup from 'fixtures/varcanService/individual/output/individualOutputMockup.json';

// EFFECTS
import * as effectOutputMockup from 'fixtures/varcanService/effect/output/effectOutputMockup.json';

// POPULATIONS
import * as populationsOutputMockup from 'fixtures/varcanService/population/output/populationsOutputMockup.json';

// GENES
import * as geneSingleParameterInputMockup from 'fixtures/varcanService/gene/input/geneSingleParameterInputMockup.json';
import * as geneMultipleParametersInputMockup from 'fixtures/varcanService/gene/input/geneMutipleParametersInputMockup.json';
import * as geneOutputMockup from 'fixtures/varcanService/gene/output/geneOutputMockup.json';
import * as geneFilteredOutputMockup from 'fixtures/varcanService/gene/output/geneFilteredOutputMockup.json';

// VARIANT
import * as variantSingleParamOutputMockup from 'fixtures/varcanService/variant/input/variantSingleParamInputMockup.json';
import * as variantMultipleParamsOutputMockup from 'fixtures/varcanService/variant/input/variantMultipleParamsInputMockup.json';

describe('VarCanService', () => {
  let service: VarCanService;

  beforeEach(() => {
    service = new VarCanService(environment.serverUrl);  // falta pasarle URL o AxiosInstance
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
    const predictedResult: Array<Biotype> = biotypeOutputMockup.biotypes;

    expect(service.getBiotypes())
      .withContext("service return Array<Biotype>")
      .toBe(predictedResult);
  });

  it("should return Array<Chromosome> (/chromosomes)", () => {
    const predictedResult: Array<Chromosome> = chromosomeOutputMockup.chromosomes;

    expect(service.getChromosomes())
      .withContext("service return Array<Chromosome>")
      .toBe(predictedResult);
  });

  it("should return Array<Impact> (/impacts)", () => {
    const predictedResult: Array<Impact> = impactOutputMockup.impacts;

    expect(service.getImpacts())
      .withContext("service return Array<Impact>")
      .toBe(predictedResult);
  }); 
  
  it("should return Array<GenotypeType> (/genotype_type)", () => {
    const predictedResult: Array<GenotypeType> = genotypeTypeOutputMockup.genotypeType;

    expect(service.getGenotypeType())
      .withContext("service return Array<GenotypeType>")
      .toBe(predictedResult);
  });    

  it("should return Array<Individual> (/individuals)", () => {
    const predictedResult: Array<Individual> = individualOutputMockup.individuals;

    expect(service.getIndividuals())
      .withContext("service return Array<Individual>")
      .toBe(predictedResult);
  });   

  it("should return Array<Effect> (/effects)", () => {
    const predictedResult: Array<Effect> = effectOutputMockup.effects;

    expect(service.getEffects())
      .withContext("service return Array<Effect>")
      .toBe(predictedResult);
  }); 
  
  it("should return Array<Population> (/populations)", () => {
    const predictedResult: Array<Population> = populationsOutputMockup.asc;
    const result: Array<Population> = service.getPopulations();

    expect(result)
      .withContext("service return Array<Population>")
      .toBe(predictedResult);
    expect(result[0].id)
      .withContext("first Population must have id 1")
      .toBe(1);
    expect(result[result.length-1].id)
      .withContext("last Population must have id 12")
      .toBe(12);
  });  
  
  it("should return Array<Population> (/populations)", () => {
    const predictedResult: Array<Population> = populationsOutputMockup.desc;
    const result: Array<Population> = service.getPopulations();

    expect(result)
      .withContext("service return Array<Population>")
      .toBe(predictedResult);
    expect(result[0].id)
      .withContext("first Population must have id 1")
      .toBe(12);
    expect(result[result.length-1].id)
      .withContext("last Population must have id 12")
      .toBe(1);
  }); 

  it("should return Page<Gene> (/genes)", () => {
    const predictedResult: Array<Gene> = geneOutputMockup.genes;

    const result = service.getGenes();

    expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(predictedResult);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(21085);  
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1055);              
  });  

  it("should return Page<Gene> filtered by query (/genes)", () => {
    const geneModel: GeneParams = geneSingleParameterInputMockup;
    const predictedResult: Array<Gene> = geneFilteredOutputMockup.genes;

    const result = service.getGenes(geneModel);

    expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(predictedResult);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(1);  
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1);              
  });  

  it("should return Page<Gene> filtered by query (/genes)", () => {
    const geneModel: GeneParams = geneMultipleParametersInputMockup;
    const predictedResult: Array<Gene> = geneFilteredOutputMockup.genes;

    const result = service.getGenes(geneModel);

    expect(result.content)
      .withContext("result.content return Array<Gene>")
      .toBe(predictedResult);
    expect(result.totalElements)
      .withContext("result.content return Array<Gene>")
      .toBe(1);  
    expect(result.totalPages)
      .withContext("result.content return Array<Gene>")
      .toBe(1);              
  });  
  
  // ToDo: esperar a que endpoint /variant esté hecho

  it("should return Page<Variant> (/variant)", () => {
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
      .toBe(1);*/
  });

  it("should return Page<Variant> filtered by query (/variant)", () => {
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
      .toBe(1);*/
  });  
  
  it("should return Page<Variant> filtered by query (/variant)", () => {
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
      .toBe(1);   */           
  });  
});
