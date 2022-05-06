import { environment } from 'src/environments/environment';

// MODELS
import { Chromosome } from '../models/output/Chromosome';
import { Impact } from '../models/output/Impact';
import { Effect } from '../models/output/Effect';
import { GenotypeType } from '../models/output/GenotypeType';
import { Individual } from '../models/output/Individual';
import { Biotype } from '../models/output/Biotype';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

export class GlobalConstants {
  private static service: VarCanService = new VarCanService(environment.serverUrl);
  private static ID_POPULATION_GCA: number;
  private static ID_POPULATION_ALL: number;
  
  static getService(): VarCanService {
    return GlobalConstants.service;
  }

/*     static getPopulationIds() {
    this.service.getPopulations().then(response => {

    })
  } */
  static setChromosomes() {
    this.service.getChromosomes().then(response => {
      localStorage.setItem('chromosomes', JSON.stringify(response.data));
    }).catch(error => console.log("Chromosomes error: " + error));
  }

  static getChromosomes(): Chromosome[] {
    return JSON.parse(localStorage.getItem('chromosomes'));
  }

  static setImpacts() {
    this.service.getImpacts().then(response => {
      localStorage.setItem('impacts', JSON.stringify(response.data));
    }).catch(error => console.log("Impacts error: " + error));
  }  
  
  static getImpacts(): Impact[] {
    return JSON.parse(localStorage.getItem('impacts'));
  }   
  
  static setEffects() {
    this.service.getEffects().then(response => {
      localStorage.setItem('effects', JSON.stringify(response.data));
    }).catch(error => console.log("Effects error: " + error));
  }  
  
  static getEffects(): Effect[] {
    return JSON.parse(localStorage.getItem('effects'));
  }  
  
  static setGenotypeTypes() {
    this.service.getGenotypeTypes().then(response => {
      localStorage.setItem('genotypeTypes', JSON.stringify(response.data));
    }).catch(error => console.log("Genotype types error: " + error));
  }  
  
  static getGenotypeTypes(): GenotypeType[] {
    return JSON.parse(localStorage.getItem('genotypeTypes'));
  } 
  
  static setIndividuals() {
    this.service.getIndividuals().then(response => {
      localStorage.setItem('individuals', JSON.stringify(response.data));
    }).catch(error => console.log("Individuals error: " + error));
  }

  static getIndividuals(): Individual[] {
    return JSON.parse(localStorage.getItem('individuals'));
  }

  static setBiotypes() {
    this.service.getBiotypes().then(response => {
      localStorage.setItem('biotypes', JSON.stringify(response.data));
    }).catch(error => console.log("Biotypes error: " + error));   
  }

  static getBiotypes(): Biotype[] {
    return JSON.parse(localStorage.getItem('biotypes'));
  }
}
