import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { VariantApiService } from '../variant-api.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  @Output() notifyFilter = new EventEmitter;
  chromosomes: SelectItem[];
  siftOptions: SelectItem[];
  polyphenOptions: SelectItem[];
  selectedSift: any;
  selectedPolyphen: any;
  selectedChromosome: any;
  gmaf: number= null;
  posMin: number = null;
  posMax: number = null;
  filteringData: any;
  
  selectedEffects: any;
  effects: any =[];
  effectSelection: any;

  biotypes: any = [];
  selectedBiotype: any;

  showSearching: boolean = false;
  search: any = "";
  searchResults: any;
  geneSelection: any;
  selectedGenes: any;
  listOfGenes: any;

  constructor( private VariantService: VariantApiService) {
    this.getEffectAndBiotype();

    this.chromosomes= [
      {label: '1', value: '1'},
      {label: '2', value: '2'},
      {label: '3', value: '3'},
      {label: '4', value: '4'},
      {label: '5', value: '5'},
      {label: '6', value: '6'},
      {label: '7', value: '7'},
      {label: '8', value: '8'},
      {label: '9', value: '9'},
      {label: '10', value: '10'},
      {label: '11', value: '11'},
      {label: '12', value: '12'},
      {label: '13', value: '13'},
      {label: '14', value: '14'},
      {label: '15', value: '15'},
      {label: '16', value: '16'},
      {label: '17', value: '17'},
      {label: '18', value: '18'},
      {label: '19', value: '19'},
      {label: '20', value: '20'},
      {label: '21', value: '21'},
      {label: '22', value: '22'},
      {label: '23', value: '23'},
      {label: 'X', value: 'X'},
      {label: 'Y', value: 'Y'},
  ];
    this.siftOptions= [
      {label: 'Tolerated', value: 'tolerated'},
      {label: 'Deleterious', value: 'deleterious'}
    ];

    this.polyphenOptions= [
      {label: 'Benign', value: 'benign'},
      {label: 'Probably_damaging', value: 'probably_damaging'},
      {label: 'Unknown', value: 'unknown'},
      {label: 'Possibly_damaging', value: 'possibly_damaging'}
    ];
  }

  ngOnInit() {
  }

  closeGeneList(){
    this.showSearching=false;
    this.search = "";
  }

  cleanChromosomeDropdown(){
    this.selectedChromosome = null;
  }

  cleanPositionMin(){
    this.posMin = null;
  }

  cleanPositionMax(){
    this.posMax = null;
  }

  cleanSiftDropdown(){
    this.selectedSift = null;
  }

  cleanPolyphenDropdown(){
    this.selectedPolyphen = null;
  }

  cleanBiotypeDropdown(){
    this.selectedBiotype = null;
  }

  cleanEffectsDropdown(){
    this.selectedEffects = null;
  }

  cleanGmaf(){
    this.gmaf = null;
  }

  searchMethod(){
    console.log(this.geneSelection);
    /*this.selectedGenes= "";
    if (this.geneSelection != undefined && this.geneSelection != []){
      this.geneSelection.forEach(element => {
        this.selectedGenes += element + ","; 
      });
      this.selectedGenes = this.selectedGenes.substring( 0, this.selectedGenes.length-1);
    }*/
  }  

  cleanFilters(){
    this.showSearching = false;
    this.selectedSift = null;
    this.selectedPolyphen = null;
    this.selectedChromosome = null;
    this.selectedBiotype = null;
    this.selectedEffects = null;
    this.selectedGenes = "";
    this.geneSelection = [];
    this.posMax = null;
    this.posMin = null;
    this.gmaf = null;
    this.search = "";
  }

  filterVariants(){
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
      term: this.selectedEffects,
      gmaf: this.gmaf
    }
    this.notifyFilter.emit(this.filteringData);
  }

  // < ------ Llamadas a la API --------->

  async getGenes(){
    var results = [];
    var genesName: any =[];
    var genesDescription: any =[];
    var searching = [];
    this.listOfGenes = [];
    this.searchResults = [];
    if (this.search.length >= 3){
      this.showSearching = true;
      results= await this.VariantService.getGenesData(this.search);
      results.forEach(element => {
        genesName.push(element.name);
        genesDescription.push(element.name);
        genesName = genesName.filter( element => element.toLowerCase().includes(this.search.toLowerCase()) == true);
        genesDescription = genesDescription.filter(element => element.toLowerCase().includes(this.search.toLowerCase()) == false);
        this.searchResults = genesName.sort().concat(genesDescription.sort());
        
        //this.searching=(this.searchResults.split(","));
      });
     /* this.searchResults.forEach(element => {
          this.searching.push({name: element});
      });*/
      console.log("Search => " + this.searchResults);
      console.log("Los buenos => " + genesName);
      console.log("Los malos => " + genesDescription);
    } else {
      this.showSearching = false;
    }
  }

  async getEffectAndBiotype(){
      var effect;
      var biotype;
      effect = await this.VariantService.getTermsData();
      effect.forEach(element => {
        this.effects.push({label: element.displayName, value: element.term});
      });
      biotype = await this.VariantService.getBiotypeData();
      biotype.sort().forEach(element => {
        this.biotypes.push({label: element, value: element});
      });
    }
}


