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
  private individualsList: Individual[];
  private genotypeTypesList: GenotypeType[];

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
      itemsShowLimit: 3,
      allowSearchFilter: true      
    }
    this.genotypesSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true      
    }    
  }

  submit(genotypeFilter) {
    const { selector, number, samples, genotypes } = genotypeFilter.value;
    console.log("samples: ", samples);
    var sampleCodes = "";
    var genotypeTypesNames = "";
    
    samples.map(sample => {
      sampleCodes = sampleCodes + ', ' + sample.code; 
    });
    genotypes.map(genotype => {
      genotypeTypesNames = genotypeTypesNames + ', ' + genotype.name;
    });

    this.appliedFilters.push(`${selector} of ${number} [${sampleCodes}] are [${genotypeTypesNames}]`);
    console.log("add filter: ", this.appliedFilters);
  }

  removeFilter() {
    console.log("remove filter");
  }

  onSampleSelect(item: any) {
    console.log(item);
  }

  onSelectAllSamples(items: any) {
    console.log(items);
  }  
}
