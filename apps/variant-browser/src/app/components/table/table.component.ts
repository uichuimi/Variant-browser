import {Component, OnInit } from '@angular/core';
import { VarCanService } from "../../services/varcan-service/var-can.service";
import { GlobalConstants } from "../../common/global-constants";
import { VariantParams } from "../../models/input/VariantParams";
import { Variant } from "../../models/output/Variant";
import { Chromosome } from "../../models/output/Chromosome";
import { Effect } from "../../models/output/Effect";
import { Biotype } from "../../models/output/Biotype";
import { Impact } from "../../models/output/Impact";
import { Individual } from "../../models/output/Individual";
import { Population } from "../../models/output/Population";
import { GenotypeType } from "../../models/output/GenotypeType";
import { VariantLine } from "../../models/data-structure/VariantLine";
import { Page } from "../../models/output/Page";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableComponent implements OnInit {
  private effects: Array<Effect>;
  private chromosomes: Array<Chromosome>;
  private biotypes: Array<Biotype>;
  private impacts: Array<Impact>;
  private individuals: Array<Individual>;
  private population: Array<Population>;
  private genotypeTypes: Array<GenotypeType>;
  private variants: Page<Variant>;
  variantLines: Array<VariantLine>;
  dataSource;
  constructor(private service: VarCanService, private globalConstants: GlobalConstants) {
    this.globalConstants.initializeLocalStorage().then(() => {
      this.effects = this.globalConstants.getEffects();
      this.chromosomes = this.globalConstants.getChromosomes();
      this.biotypes = this.globalConstants.getBiotypes();
      this.impacts = this.globalConstants.getImpacts();
      this.individuals = this.globalConstants.getIndividuals();
      this.population = this.globalConstants.getPopulation();
      this.genotypeTypes = this.globalConstants.getGenotypeTypes();
    });
  }

  ngOnInit(): void {
    console.log('Init table');
    // this.getVariants();
  }

  /*getVariants(data: VariantParams = {size: this.size, page: this.page}, callbackFunction?) {
    console.log('=============search variants=============');
    this.loading = true;

    this.service.getVariants({size: this.size, page: this.page, ...data}).then(response => {
      console.log('response', response);
      callbackFunction ?
        this.onSuccessResponse(response.data.content, callbackFunction) : this.onSuccessResponse(response.data);
    }).catch(error => {
      console.log('variants error: ' + error);
    });
  }

  // MÉTODOS AUXILIARES
  onSuccessResponse(data, callbackFunction?) {
    this.loading = false;
    this.first = data.first;
    this.last = data.last;
    this.totalPages = data.totalPages;
    this.numberOfElements = data.numberOfElements;     // NÚMERO DE ELEMENTOS EN LA PÁG.
    this.filteredElements = data.totalElements;        // NÚMERO DE ELEMENTOS EN TODAS LAS PÁGS.

    const props = this;
    if (callbackFunction) { callbackFunction(props); }     // CALCULAR ÍNDICES PARA ÚLTIMA PÁG.

    this.calculateDP(data);              // CALCULAR DPs
    this.calculateLocalFrequency(data);  // CALCULAR FRECUENCIA LOCAL
    this.calculateGlobalFrequency(data); // CALCULAR FRECUENCIA GLOBAL
    this.getGeneSymbol(data);            // OBTENER SÍMBOLO DEL GEN
    this.getCoordinate(data);            // OBTENER UCSC
    this.getConsequence(data);           // OBTENER CONSECUENCIAS
    console.log('variants dady cool: ', this.variants);
  }

  calculateDP(data) {
    let an = 0;

    data.content.map((variant) => {
      variant.frequencies.map((frequency) => {
        an += frequency.an;
      });
      this.dp.push(an);
      an = 0;
    });
  }

  calculateLocalFrequency(data) {
    let ac = 0;
    let an = 0;
    let af = 0;

    data.content.map((variant) => {
      variant.frequencies.map((frequency) => {
        if (frequency.population === 1) {
          ac = frequency.ac;
          an = frequency.an;
        }
      });
      if (an !== 0) {
        af = ac / an;
        af = Number(af.toFixed(4));
      }

      this.localFrequency.push(ac + ' / ' + an + ' (' + af + ')');
      ac = 0;
      an = 0;
      af = 0;
    });
  }

  calculateGlobalFrequency(data) {
    let ac = 0;
    let an = 0;
    let af = 0;

    data.content.map((variant) => {
      variant.frequencies.map((frequency) => {
        if (frequency.population === 2) {
          ac = frequency.ac;
          an = frequency.an;
        }
      });
      if (an !== 0) {
        af = ac / an;
        af = Number(af.toFixed(4));
      }

      this.globalFrequency.push(ac + ' / ' + an + ' (' + af + ')');
      ac = 0;
      an = 0;
      af = 0;
    });
  }

  getGeneSymbol(data) {
    data.content.map(variant => {
      this.service.getBatchGenes({ids: [variant.consequence[0].gene]}).then(response => {
        this.geneSymbols.push(response.data[0].symbol);
      }).catch(error => console.log('BacthGenes error: ' + error));
    });
  }

  getCoordinate(data) {
    let chromosomeElement: Chromosome;
    data.content.map(variant => {
      chromosomeElement = this.chromosomesList.find(element => element.id === variant.chromosome);
      this.ucsc.push(chromosomeElement.ucsc);
    });
  }

  getConsequence(data) {
    let effect: Effect;
    data.content.map(variant => {
      effect = this.effectsList.find(element => element.id === variant.consequence[0].effect);
      this.effect.push(effect.description);
    });
  }

  // CALCULAR INICIO, FIN Y NUM. DE PÁG. CUANDO SE VA A LA ÚLTIMA PÁG.
  calculateLastPageIndexes(props) {
    props.initial = props.numberOfElements - (props.numberOfElements % 20);
    props.final = props.numberOfElements;
    props.pageNumber = (props.totalPages - 1) * 10 + props.adjustPageNumber(props.initial);
  }

  // AJUSTAR NUM. DE PÁG QUE SE MUESTRA EN PIE DE PÁGINA
  adjustPageNumber(page): number {
    const valueTransform = {
      0: 1,
      20: 2,
      40: 3,
      60: 4,
      80: 5,
      100: 6,
      120: 7,
      140: 8,
      160: 9,
      180: 10
    };
    return valueTransform[page];
  }

  selectVariant(variant: Variant) {
    if (this.selectedVariant === variant) {
      this.selectedVariant = null;
    } else {
      this.selectedVariant = variant;
    }
  }

  // CONTROL DE EVENTOS
  mouseOver(event, ref, alt) {
    const container = document.getElementById('refAltContainer');
    // STORE MOUSE POSITION
    const positionX = event.pageX - 100;
    const positionY = event.pageY + 30;
    console.log('position: ' + container.offsetWidth);

    container.style.left = positionX + 'px';
    container.style.top = positionY + 'px';
    container.style.display = 'block';

    this.variantToShow = ref + ' / ' + alt;
    console.log('variantToShow: ' + this.variantToShow);
  }

  mouseLeave() {
    const container = document.getElementById('refAltContainer');
    container.style.display = 'none';
  }

  toggleProperty(filter: string) {
    this.filterToShow = filter;
  }

  nextPage() {
    this.pageNumber += 1;
    this.initial += 20;
    this.final += 20;

    // SI EN LA ÚLTIMA PÁG. SE SOBREPASA EL NUM. DE ELEMENTOS LO AJUSTAMOS
    if (this.last && this.final > this.numberOfElements) { this.final = this.numberOfElements; }

    if (this.final % 220 === 0) {
      this.loading = true;
      this.page += 1;
      this.initial = 0;
      this.final = 20;
      this.getVariantsDef();
    }
  }

  prevPage() {
    this.pageNumber -= 1;
    if (this.initial === 0) {
      this.loading = true;
      this.page -= 1;
      this.initial = 180;
      this.final = 200;
      this.getVariantsDef();
    } else {
      this.final = this.initial;
      this.initial -= 20;
    }
  }

  firstPage() {
    this.pageNumber = 1;
    this.loading = true;
    this.initial = 0;
    this.final = 20;
    this.page = 0;
    this.getVariantsDef();
  }

  lastPage() {
    this.loading = true;
    this.page = this.totalPages - 1;
    this.getVariantsDef(this.calculateLastPageIndexes);
  }

  setGenotypeTypesFilter(data) {
    console.log('genotypes: ', data);
    this.appliedGenotypeFilters = data;
  }

  setPropertiesFilter(data) {
    console.log('properties: ', data);
    this.appliedPropertiesFilters = data;
  }

  getVariantsDef(callbackFunction?) {
    const appliedGenotypeFilters: Array<GenotypeFilterParams> = this.appliedGenotypeFilters == null ? null : [this.appliedGenotypeFilters];
    this.appliedPropertiesFilters.genotypeFilters = appliedGenotypeFilters;
    console.log(this.appliedPropertiesFilters);
    this.getVariants(this.appliedPropertiesFilters);
    // console.log(this.appliedGenotypeFilters);
    // if (Object.keys(this.appliedPropertiesFilters).length === 0 && Object.keys(this.appliedGenotypeFilters).length === 0) {
    //   callbackFunction ? this.getAllVariants(callbackFunction) : this.getAllVariants();
    // } else if (Object.keys(this.appliedPropertiesFilters).length === 0 && Object.keys(this.appliedGenotypeFilters).length !== 0) {
    //   callbackFunction ? this.getVariantsFilteredByGenotypes(callbackFunction) : this.getVariantsFilteredByGenotypes();
    // } else if (Object.keys(this.appliedPropertiesFilters).length !== 0 && Object.keys(this.appliedGenotypeFilters).length === 0) {
    //   callbackFunction ? this.getVariantsFilteredByProperties(callbackFunction) : this.getVariantsFilteredByProperties();
    // } else if (Object.keys(this.appliedPropertiesFilters).length !== 0 && Object.keys(this.appliedGenotypeFilters).length !== 0) {
    //   callbackFunction ? this.getVariantsFiltered(callbackFunction) : this.getVariantsFiltered();
    // }
  }

  resetShownVariants() {
    this.page = 0;
    this.pageNumber = 1;
    this.initial = 0;
    this.final = 20;
    this.getVariantsDef();
  }

  resetGenotypeFilter() {
    this.appliedGenotypeFilters = {};
  }*/
}
