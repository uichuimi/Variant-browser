import { Chromosome } from '../models/output/Chromosome';
import { Impact } from '../models/output/Impact';
import { Effect } from '../models/output/Effect';
import { GenotypeType } from '../models/output/GenotypeType';
import { Individual } from '../models/output/Individual';
import { Biotype } from '../models/output/Biotype';
import {Population} from '../models/output/Population';
import {Injectable} from '@angular/core';
import { VarCanService } from "../services/varcan-service/var-can.service";

@Injectable({
  providedIn: 'root'
})

export class GlobalConstants {

  constructor(private service: VarCanService) {
  }
  private static ID_POPULATION_GCA: number;
  private static ID_POPULATION_ALL: number;

  static run(f: Record<string, any>, method: Exclude<keyof GlobalConstants, 'run'>): any {
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
      impacts.sort((a, b) => a.id - b.id);
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

  async initializeLocalStorage(): Promise<void> {
    await this.initializeChromosomes();
    await this.initializeEffects();
    await this.initializeImpacts();
    await this.initializeGenotypeTypes();
    await this.initializeIndividuals();
    await this.initializeBiotypes();
    await this.initializePopulation();
  }
}
