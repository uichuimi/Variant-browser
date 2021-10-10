import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { VariantApiService } from '../../services/variant-api.service';

import { Gene } from '../../interfaces/interfaces';

function genes_comparator(term: string) {
  return (a, b) => {
    if (a.name.toLowerCase().includes(term)) {
      if (b.name.toLowerCase().includes(term)) {
        return a.name.localeCompare(b.name);
      } else {
        return -1;
      }
    } else {
      if (b.name.toLowerCase().includes(term)) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  };
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  @Output() notifyFilter = new EventEmitter;

  selectedSift: any;
  selectedPolyphen: any;
  selectedChromosome: any;
  gmaf: number = undefined;
  posMin: number;
  posMax: number;
  filteringData: any;

  selectedImpact: any;
  effectSelection: any;

  selectedBiotype: any;

  genesList: any = []

  showSearching: boolean = false;
  search: any = "";
  geneSelection: any;
  selectedGenes: any;

  selectedSamplesCase: any = undefined;
  selectedSamplesControl: any = undefined;

  selectedMode: any = undefined;

  genotypeFilter = [
  {value: "DOMINANT", label:"Dominant"},
  {value: "RECESSIVE", label:"Recessive"}
  ]

  
  //The list of all the filters available with their label and value on each filter of the HTML
  //In order to add a new one, added to the filter list and initialize it as an empty array
  filterList: {
    chromsList: {value: string, label: string}[],
    impactsList: {value: string, label: string}[],
    polyphenList: {value: string, label: string}[],
    siftList: {value: string, label: string}[],
    samplesList: {value: string, label: string}[],
    biotypesList: {value: string, label: string}[],
  } = {
    chromsList: [],
    impactsList: [],
    polyphenList: [],
    siftList: [],
    samplesList: [],
    biotypesList: [],
  };

  //Headers for the filterList var in order to access the API and get their values
  //Each header must correspond with one of the filters in the filterList
  dataHeaders = [
  "chroms",
  "impacts",
  "polyphen",
  "sift",
  "samples",
  "biotypes"
  ]

  constructor(private VariantService: VariantApiService) {
    this.getFilters();
  }

  ngOnInit() {
  }

  closeGeneList() {
    this.showSearching = false;
    this.search = "";
  }

  cleanChromosomeDropdown() {
    this.selectedChromosome = undefined;
  }

  cleanPositionMin() {
    this.posMin = undefined;
  }

  cleanPositionMax() {
    this.posMax = undefined;
  }

  cleanSiftDropdown() {
    this.selectedSift = undefined;
  }

  cleanPolyphenDropdown() {
    this.selectedPolyphen = undefined;
  }

  cleanBiotypeDropdown() {
    this.selectedBiotype = undefined;
  }

  cleanEffectsDropdown() {
    this.selectedImpact = undefined;
  }

  cleanGmaf() {
    this.gmaf = undefined;
  }

  cleanSamplesControlDropdown(){
    this.selectedSamplesControl = undefined;
  }

  cleanSamplesCaseDropdown(){
    this.selectedSamplesCase = undefined;
  }

  cleanModeDropdown(){
    this.selectedMode = undefined;
  }

  selectedModeAndCases(){
    return (this.selectedMode && !this.selectedSamplesCase);
  }

  searchMethod() {
    this.selectedGenes = undefined;
    if (this.geneSelection != undefined && this.geneSelection.length != 0) {
      this.selectedGenes = [];
      this.geneSelection.forEach(element => {
        this.selectedGenes.push(element.symbol);
      });
    }
  }

  cleanFilters() {
    this.showSearching = false;
    this.selectedSift = undefined;
    this.selectedPolyphen = undefined;
    this.selectedChromosome = undefined;
    this.selectedBiotype = undefined;
    this.selectedImpact = undefined;
    this.selectedGenes = undefined;
    this.geneSelection = [];
    this.posMax = undefined;
    this.posMin = undefined;
    this.gmaf = undefined;
    this.selectedSamplesControl = undefined;
    this.selectedSamplesCase = undefined;
    this.selectedMode = undefined;
    this.search = '';
    this.selectedMode = undefined;
    this.selectedSamplesCase = undefined;
    this.selectedSamplesControl = undefined;
    console.log(this.filterList);

  }

  filterVariants() {
    this.showSearching = false;
    this.searchMethod();
    this.filteringData = {
      chromosome: this.selectedChromosome,
      posMin: this.posMin,
      posMax: this.posMax,
      gene: this.selectedGenes,
      sift: this.selectedSift,
      polyphen: this.selectedPolyphen,
      biotype: this.selectedBiotype,
      impact: this.selectedImpact,
      gmaf: this.gmaf,
      mode: this.selectedMode,
      cases: this.selectedSamplesCase,
      controls: this.selectedSamplesControl
    }
    this.notifyFilter.emit(this.filteringData);
  }

  // < ------ Llamadas a la API --------->

  //Function called each time a key is pressed in the "Search genes" input
  //Calls the API with the genes endpoint in order to search for the desired Gene
  async getGenes() {
    this.genesList = [];
    if (this.search.length >= 3) {
      this.showSearching = true;
      this.genesList = await this.VariantService.getGenesData(this.search);
      this.genesList.sort(genes_comparator(this.search.toLowerCase()));
      console.log(this.genesList);

    } else {
      this.showSearching = false;
    }
  }

  //Function that retrieves all the values for the filterList based on the values of dataHeaders
  //Assigns the response of each endpoint given by dataHeaders to its corresponding filterList value
  async getFilters() {
    let index = 0;
    for (var [key, value] of Object.entries(this.filterList)) {
      await this.VariantService.getFilterData(this.dataHeaders[index]).then(response => {
        response.sort().forEach(element => {
          if (this.dataHeaders[index] == "samples") {
            this.filterList[key].push({label: element.identifier, value: element.identifier});
          }else if(this.dataHeaders[index] == "biotypes"){
            this.filterList[key].push({label: element.name, value: element.name});            
          }else{
            this.filterList[key].push({label: element, value: element});
          }
        });
      });
      index+=1;
    }
    this.filterList.chromsList.sort(
      (a,b) =>{
        var first: number = +a.label.substring(3);
        var second: number = +b.label.substring(3);
        if (first > second) {
          return 1;
        }

        if (first < second) {
          return -1;
        }

        return 0;
      });
  }
}