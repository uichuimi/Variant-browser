import { Chromosome } from '../api/varcan-service/models/response/Chromosome';
import { Impact } from '../api/varcan-service/models/response/Impact';
import { Effect } from '../api/varcan-service/models/response/Effect';
import { GenotypeType } from '../api/varcan-service/models/response/GenotypeType';
import { Individual } from '../api/varcan-service/models/response/Individual';
import { Biotype } from '../api/varcan-service/models/response/Biotype';
import {Population} from '../api/varcan-service/models/response/Population';
import { Injectable } from "@angular/core";
import { VarcanService } from "../api/varcan-service/varcan.service";

@Injectable({
  providedIn: 'root'
})

export class GlobalConstants {
  constructor(private service: VarcanService) {
    this.service.refreshLogin();
  }


  run(f: Record<string, any>, method: Exclude<keyof GlobalConstants, 'run'>): any {
    return f[method]();
  }

  private initializeChromosomes() {
    this.service.getChromosomes().then(response => {
      const chromosomes: Array<Chromosome> = response.data;
      chromosomes.sort((a, b) => a.id - b.id);
      localStorage.setItem('chromosomes', JSON.stringify(chromosomes));
    }).catch(error => console.log('Chromosomes error: ' + error));
  }

  getChromosomes(): Chromosome[] {
    return JSON.parse(localStorage.getItem('chromosomes'));
  }

  private initializeImpacts() {
    this.service.getImpacts().then(response => {
      const impacts: Array<Impact> = response.data;
      impacts.sort((a, b) => a.sequence - b.sequence);
      localStorage.setItem('impacts', JSON.stringify(impacts));
    }).catch(error => console.log('Impacts error: ' + error));
  }

  getImpacts(): Impact[] {
    return JSON.parse(localStorage.getItem('impacts'));
  }

  private initializeEffects() {
    this.service.getEffects().then(response => {
      const effects: Array<Effect> = response.data;
      effects.sort((a, b) => a.accession.localeCompare(b.accession));
      localStorage.setItem('effects', JSON.stringify(effects));
    }).catch(error => console.log('Effects error: ' + error));
  }

  getEffects(): Effect[] {
    return JSON.parse(localStorage.getItem('effects'));
  }

  private initializeGenotypeTypes() {
    this.service.getGenotypeTypes().then(response => {
      const genotypeTypes: Array<GenotypeType> = response.data;
      genotypeTypes.sort((a, b) => a.id - b.id);
      localStorage.setItem('genotypeTypes', JSON.stringify(genotypeTypes));
    }).catch(error => console.log('Genotype types error: ' + error));
  }

  getGenotypeTypes(): GenotypeType[] {
    return JSON.parse(localStorage.getItem('genotypeTypes'));
  }

  private initializeIndividuals() {
    this.service.getIndividuals().then(response => {
      const individuals: Array<Individual> = response.data;
      individuals.sort((a, b) => a.code.localeCompare(b.code));
      localStorage.setItem('individuals', JSON.stringify(individuals));
    }).catch(error => console.log('Individuals error: ' + error));
  }

  getIndividuals(): Individual[] {
    return JSON.parse(localStorage.getItem('individuals'));
  }

  private initializeBiotypes() {
    this.service.getBiotypes().then(response => {
      const biotypes: Array<Biotype> = response.data;
      biotypes.sort((a, b) => a.accession.localeCompare(b.accession));
      localStorage.setItem('biotypes', JSON.stringify(biotypes));
    }).catch(error => console.log('Biotypes error: ' + error));
  }

  getBiotypes(): Biotype[] {
    return JSON.parse(localStorage.getItem('biotypes'));
  }

  private initializePopulation() {
    this.service.getPopulations().then(response => {
      const population: Array<Population> = response.data;
      population.sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem('population', JSON.stringify(population));
    }).catch(error => console.log('Population error: ', error));
  }

  getPopulation(): Population[] {
    return JSON.parse(localStorage.getItem('population'));
  }

  public initializeLocalStorage() {
    console.log("INITIALIZING GLOBAL VARIABLES");
    this.initializeChromosomes();
    this.initializeEffects();
    this.initializeImpacts();
    this.initializeGenotypeTypes();
    this.initializeIndividuals();
    this.initializeBiotypes();
    this.initializePopulation();
  }
}
