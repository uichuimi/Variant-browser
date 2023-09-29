import {Chromosome} from '../api/varcan-service/models/response/Chromosome';
import {Impact} from '../api/varcan-service/models/response/Impact';
import {Effect} from '../api/varcan-service/models/response/Effect';
import {GenotypeType} from '../api/varcan-service/models/response/GenotypeType';
import {Individual} from '../api/varcan-service/models/response/Individual';
import {Biotype} from '../api/varcan-service/models/response/Biotype';
import {Population} from '../api/varcan-service/models/response/Population';
import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {VarcanService} from "../api/varcan-service/varcan.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class GlobalConstants implements OnInit, OnDestroy {
  private _chromosomesSubject = new BehaviorSubject<Chromosome[]>(null);
  private _impactsSubject = new BehaviorSubject<Impact[]>(null);
  private _effectsSubject = new BehaviorSubject<Effect[]>(null);
  private _genotypeTypesSubject = new BehaviorSubject<GenotypeType[]>(null);
  private _individualsSubject = new BehaviorSubject<Individual[]>(null);
  private _populationsSubject = new BehaviorSubject<Population[]>(null);
  private _biotypesSubject = new BehaviorSubject<Biotype[]>(null);

  constructor(private service: VarcanService) {
    this.service.refreshLogin();
    console.log("INITIALIZING GLOBAL VARIABLES");
    this.initializeLocalStorage();
  }

  get chromosomes$(): Observable<Chromosome[]> {
    return this._chromosomesSubject.asObservable();
  }

  get impacts$(): Observable<Impact[]> {
    return this._impactsSubject.asObservable();
  }

  get effects$(): Observable<Effect[]> {
    return this._effectsSubject.asObservable();
  }

  get genotypeTypes$(): Observable<GenotypeType[]> {
    return this._genotypeTypesSubject.asObservable();
  }

  get individuals$(): Observable<Individual[]> {
    return this._individualsSubject.asObservable();
  }

  get populations$(): Observable<Population[]> {
    return this._populationsSubject.asObservable();
  }

  get biotypes$(): Observable<Biotype[]> {
    return this._biotypesSubject.asObservable();
  }

  ngOnInit(): void {
    this._chromosomesSubject.subscribe((chromosomes) => {
      console.log(chromosomes);
      localStorage.setItem('chromosomes', JSON.stringify(chromosomes));
    });

    this._impactsSubject.subscribe((impacts) => {
      localStorage.setItem('impacts', JSON.stringify(impacts));
    });

    this._effectsSubject.subscribe((effects) => {
      localStorage.setItem('effects', JSON.stringify(effects));
    });

    this._genotypeTypesSubject.subscribe((genotypeTypes) => {
      localStorage.setItem('genotypeTypes', JSON.stringify(genotypeTypes));
    });

    this._individualsSubject.subscribe((individuals) => {
      localStorage.setItem('individuals', JSON.stringify(individuals));
    });

    this._populationsSubject.subscribe((populations) => {
      localStorage.setItem('populations', JSON.stringify(populations));
    });

    this._biotypesSubject.subscribe((biotypes) => {
      localStorage.setItem('biotypes', JSON.stringify(biotypes));
    });
  }

  ngOnDestroy(): void {
    this._chromosomesSubject.unsubscribe();
    this._impactsSubject.unsubscribe();
    this._effectsSubject.unsubscribe();
    this._genotypeTypesSubject.unsubscribe();
    this._individualsSubject.unsubscribe();
    this._populationsSubject.unsubscribe();
    this._biotypesSubject.unsubscribe();
  }


  get chromosomes(): Chromosome[] {
    return JSON.parse(localStorage.getItem('chromosomes')) || this._chromosomesSubject.value;
  }

  get impacts(): Impact[] {
    return JSON.parse(localStorage.getItem('impacts')) || this._impactsSubject.value;
  }

  get effects(): Effect[] {
    return JSON.parse(localStorage.getItem('effects')) || this._effectsSubject.value;
  }

  get genotypeTypes(): GenotypeType[] {
    return JSON.parse(localStorage.getItem('genotypeTypes')) || this._genotypeTypesSubject.value;
  }

  get individuals(): Individual[] {
    return JSON.parse(localStorage.getItem('individuals')) || this._individualsSubject.value;
  }

  get populations(): Population[] {
    return JSON.parse(localStorage.getItem('populations')) || this._populationsSubject.value;
  }

  get biotypes(): Biotype[] {
    return JSON.parse(localStorage.getItem('biotypes')) || this._biotypesSubject.value;
  }

  run(f: Record<string, any>, method: Exclude<keyof GlobalConstants, 'run'>): any {
    return f[method]();
  }

  private initializeChromosomes() {
    this.service.getChromosomes().then(response => {
      const chromosomes: Array<Chromosome> = response.data;
      chromosomes.sort((a, b) => a.id - b.id);
      this._chromosomesSubject.next(chromosomes);
    }).catch(error => console.error('Chromosomes error: ' + error));
  }

  private initializeImpacts() {
    this.service.getImpacts().then(response => {
      const impacts: Array<Impact> = response.data;
      impacts.sort((a, b) => a.sequence - b.sequence);
      this._impactsSubject.next(impacts);
    }).catch(error => console.error('Impacts error: ' + error));
  }

  private initializeEffects() {
    this.service.getEffects().then(response => {
      const effects: Array<Effect> = response.data;
      effects.sort((a, b) => a.accession.localeCompare(b.accession));
      this._effectsSubject.next(effects);
    }).catch(error => console.error('Effects error: ' + error));
  }

  private initializeGenotypeTypes() {
    this.service.getGenotypeTypes().then(response => {
      const genotypeTypes: Array<GenotypeType> = response.data;
      genotypeTypes.sort((a, b) => a.id - b.id);
      this._genotypeTypesSubject.next(genotypeTypes);
    }).catch(error => console.error('Genotype types error: ' + error));
  }

  private initializeIndividuals() {
    this.service.getIndividuals().then(response => {
      const individuals: Array<Individual> = response.data;
      individuals.sort((a, b) => a.code.localeCompare(b.code));
      this._individualsSubject.next(individuals);
    }).catch(error => console.error('Individuals error: ' + error));
  }

  private initializeBiotypes() {
    this.service.getBiotypes().then(response => {
      const biotypes: Array<Biotype> = response.data;
      biotypes.sort((a, b) => a.accession.localeCompare(b.accession));
      this._biotypesSubject.next(biotypes);
    }).catch(error => console.error('Biotypes error: ' + error));
  }

  private initializePopulations() {
    this.service.getPopulations().then(response => {
      const populations: Array<Population> = response.data;
      populations.sort((a, b) => a.name.localeCompare(b.name));
      this._populationsSubject.next(populations);
    }).catch(error => console.error('populations error: ', error));
  }

  public initializeLocalStorage() {
    this.initializeChromosomes();
    this.initializeEffects();
    this.initializeImpacts();
    this.initializeGenotypeTypes();
    this.initializeIndividuals();
    this.initializeBiotypes();
    this.initializePopulations();
  }
}
