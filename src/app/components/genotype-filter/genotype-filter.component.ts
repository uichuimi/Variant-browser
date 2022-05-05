import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

// CONSTANTS
import { GlobalConstants } from 'src/app/common/global-constants';

// MODELS
import { Individual } from 'src/app/models/output/Individual';
import { GenotypeType } from 'src/app/models/output/GenotypeType';

@Component({
  selector: 'app-genotype-filter',
  templateUrl: './genotype-filter.component.html',
  styleUrls: ['./genotype-filter.component.css']
})
export class GenotypeFilterComponent implements OnInit {
  individualsList: Individual[];
  genotypeTypesList: GenotypeType[];

  appliedFilters: Array<String> = [];
  samplesSettings: IDropdownSettings = {};
  selectedSamples = [];
  genotypesSettings: IDropdownSettings = {};
  selectedGenotypeTypes = [];

  constructor() { }

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
  }

  submit(genotypeFilter) {
    const { selector, number, samples, genotypes } = genotypeFilter.value;
    var sampleCodes = "";
    var genotypeTypesNames = "";

    // EXTRAER SAMPLES Y GENOTYPE TYPES Y CONVERTIRLOS A STRING
    samples.map(sample => {
      sampleCodes = sampleCodes + ', ' + sample.code; 
    });
    genotypes.map(genotype => {
      genotypeTypesNames = genotypeTypesNames + ', ' + genotype.name;
    });

    // ELIMINAR PRIMERA COMA
    sampleCodes = sampleCodes.substring(2);
    genotypeTypesNames = genotypeTypesNames.substring(2);

    typeof number !== 'undefined' ? 
      this.appliedFilters.push(`${selector} of ${number} [${sampleCodes}] are [${genotypeTypesNames}]`) :
      this.appliedFilters.push(`${selector} of [${sampleCodes}] are [${genotypeTypesNames}]`);
  }

  removeFilter(indice) {
    console.log("remove filter");
    this.appliedFilters.splice(indice,1);
  }

  onSampleSelect(item: any) {
    console.log(item);
  }

  onSelectAllSamples(items: any) {
    console.log(items);
  }  
}
