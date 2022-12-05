import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Variant } from "../../models/output/Variant";
import { Impact } from "../../models/output/Impact";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { VariantLineDatasourceService } from "../../services/data-source/variant-line/variant-line-datasource.service";
import { VariantLine } from "../../models/table/VariantLine";
import { Sort } from "@angular/material/sort";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";

interface TableHeaderMeta {
  name: string;
  label: string;
}

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
  protected columnsToDisplay: Array<TableHeaderMeta> = [
    { name: "id", label: "ID" },
    { name: "snpId", label: "SNP ID" },
    { name: "region", label: "Region" },
    { name: "variant", label: "Variant" },
    { name: "gene", label: "Gene" },
    { name: "effect", label: "Effect" },
    { name: "impact", label: "Impact" },
    { name: "frequency", label: "Frequency (GC)" },
    { name: "gmaf", label: "Global Minor Allele Frequency (GMAF)" },
    { name: "dp", label: "Total Depth (DP)" }
  ];
  protected displayedColumns: Array<string> = this.columnsToDisplay.slice(1)
    .map((headerMeta: TableHeaderMeta) => headerMeta.name);

  constructor(protected dataSource: VariantLineDatasourceService) {}

  ngOnInit(): void {
    console.log('Init table');
    // this.getVariants();
  }

  sortData(event: Sort) {
    this.dataSource.sortData(event);
  }

  getTooltip(column: string, line: VariantLine) {
    return line[column];
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
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

    data.content.map((variant-line) => {
      variant-line.frequencies.map((frequency) => {
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

    data.content.map((variant-line) => {
      variant-line.frequencies.map((frequency) => {
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

    data.content.map((variant-line) => {
      variant-line.frequencies.map((frequency) => {
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
    data.content.map(variant-line => {
      this.service.getBatchGenes({ids: [variant-line.consequence[0].gene]}).then(response => {
        this.geneSymbols.push(response.data[0].symbol);
      }).catch(error => console.log('BacthGenes error: ' + error));
    });
  }

  getCoordinate(data) {
    let chromosomeElement: Chromosome;
    data.content.map(variant-line => {
      chromosomeElement = this.chromosomesList.find(element => element.id === variant-line.chromosome);
      this.ucsc.push(chromosomeElement.ucsc);
    });
  }

  getConsequence(data) {
    let effect: Effect;
    data.content.map(variant-line => {
      effect = this.effectsList.find(element => element.id === variant-line.consequence[0].effect);
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

  selectVariant(variant-line: Variant) {
    if (this.selectedVariant === variant-line) {
      this.selectedVariant = null;
    } else {
      this.selectedVariant = variant-line;
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
