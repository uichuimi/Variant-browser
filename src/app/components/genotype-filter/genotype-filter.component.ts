import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

// CONSTANTS
import { GlobalConstants } from 'src/app/common/global-constants';

// MODELS
import { Individual } from 'src/app/models/output/Individual';
import { GenotypeType } from 'src/app/models/output/GenotypeType';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

@Component({
  selector: 'app-genotype-filter',
  templateUrl: './genotype-filter.component.html',
  styleUrls: ['./genotype-filter.component.css']
})
export class GenotypeFilterComponent implements OnInit {
  individualsList: Individual[];
  genotypeTypesList: GenotypeType[];

  appliedFilters: any = {};
  samplesSettings: IDropdownSettings = {};
  selectedSamples = [];
  genotypesSettings: IDropdownSettings = {};
  selectedGenotypeTypes = [];

  // OUTPUT EVENTS
  @Output() resetPageEvent = new EventEmitter();
  @Output() notifyFilterEvent = new EventEmitter();

  ngOnInit(): void {
    this.individualsList = GlobalConstants.getIndividuals();
    this.genotypeTypesList = GlobalConstants.getGenotypeTypes();

    this.samplesSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'code',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true      
    }
    this.genotypesSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true      
    }  
    this.getAllFilters();  
  }

  // MÉTODOS PARA FILTRADO
  addFilter(genotypeFilter) {
    const { selector, number, samples, genotypes } = genotypeFilter.value;
    var sampleCodes = "";
    var genotypeTypesNames = "";
    var genotypeFilters;
    var individual = [];
    var genotypeType = [];

    // EXTRAER SAMPLES Y GENOTYPE TYPES Y CONVERTIRLOS A STRING
    samples.map(sample => {
      sampleCodes = sampleCodes + ', ' + sample.code; 
      individual.push(sample.id);
    });
    genotypes.map(genotype => {
      genotypeTypesNames = genotypeTypesNames + ', ' + genotype.name;
      genotypeType.push(genotype.id);
    });

    // ELIMINAR PRIMERA COMA
    sampleCodes = sampleCodes.substring(2);
    genotypeTypesNames = genotypeTypesNames.substring(2);


    if (typeof number !== 'undefined') {
      this.appliedFilters = {
        ...this.appliedFilters, 
        'filter': `${selector} of ${number} [${sampleCodes}] are [${genotypeTypesNames}]`
      };
      //this.appliedFilters.push(`${selector} of ${number} [${sampleCodes}] are [${genotypeTypesNames}]`)
      genotypeFilters = {
        individual,
        genotypeType,
        selector,
        number
      }
    } else {
      this.appliedFilters = {
        ...this.appliedFilters, 
        'filter': `${selector} of [${sampleCodes}] are [${genotypeTypesNames}]`
      };      
      //this.appliedFilters.push(`${selector} of [${sampleCodes}] are [${genotypeTypesNames}]`);
      genotypeFilters = {
        individual,
        genotypeType,
        selector
      }
    }

    // PERSISTIR FILTROS
    localStorage.setItem("allFiltersGenotype", JSON.stringify(this.appliedFilters));  
    
    // OBTENER TODOS LOS FILTROS
    this.getAllFilters();

    this.notifyFilterEvent.emit(genotypeFilters);
    this.resetPageEvent.emit();
  }

  removeFilter(key) {
    delete this.appliedFilters[key];
    localStorage.setItem("allFiltersGenotype", JSON.stringify(this.appliedFilters));  // ELIMINAR FILTRO DE LOCALSTORAGE
    this.notifyFilterEvent.emit({});
    this.resetPageEvent.emit();
  }

  getAllFilters() {
    this.appliedFilters = JSON.parse(localStorage.getItem("allFiltersGenotype"));
  }

/*   calculateExtraFilters(): number {
    return this.appliedFilters.length - 5;
  }  */

  getAppliedFiltersLength() {
    return Object.keys(this.appliedFilters).length;
  }  
}
