import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { Options } from 'ng5-slider';
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
  gmaf: number= 0.01;
  posMin: number = 0;
  posMax: number = 250000000;
  options: Options; 
  
  items: SelectItem[];
  item: string;

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

  filteringData: any;

  constructor( private VariantService: VariantApiService) {
    this.getData();
    
    this.options = {
      floor: 0, 
      ceil: 1, 
      step: 0.001
    } 

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

  onBlurMin(){
    if (this.posMin == null){
      this.posMin = 0;
    }
    console.log(this.posMin);
  }

  onBlurMax(){
    if (this.posMax == null){
      this.posMax = 250000000;
    }
    console.log(this.posMax);
  }

  onBlurSearch(){
    console.log("EEEEEOOOOOO");
    /*this.showSearching = false;
    this.search = "";*/
  }

  /*onBlurGmaf(){
    if (this.gmaf > 1){
      this.gmaf = 1;
    } else if (this.gmaf < 0){
      this.gmaf = 0;
    }
  }*/

  erraseGmaf(){
    this.gmaf = null;
  }

  searchMethod(){
    //this.selectedGenes= "";
    console.log("Esto =>" + this.geneSelection);
    if (this.geneSelection != undefined){
      this.geneSelection.forEach(element => {
        this.selectedGenes += element.name + ","; 
      });
      this.selectedGenes = this.selectedGenes.substring(0,this.selectedGenes.length-1);
      console.log("Genes => " +  this.selectedGenes);
    }
  }  

  cleanFilters(){
    this.selectedSift = null;
    this.selectedPolyphen = null;
    this.selectedChromosome = null;
    this.selectedBiotype = null;
    this.selectedEffects = null;
    this.selectedGenes = null;
    this.posMax = 250000000;
    this.posMin = 0;
    this.gmaf = 0.01;
    //this.filterVariants();
  }

  filterVariants(){
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
    console.log("Sift => " + this.selectedSift);
    console.log("Polyphen => " + this.selectedPolyphen);
    console.log("Chromosome => " + this.selectedChromosome);
    console.log("Biotype => " + this.selectedBiotype);
    console.log("Effects => " + this.selectedEffects);
    console.log("Genes => " +  this.selectedGenes);
    console.log("Max => " + this.posMax);
    console.log("Min => "+ this.posMin);
    console.log("Gmaf => " + this.gmaf);
  }

  // < ------ Llamadas a la API --------->
  async getSearch(){
    if (this.search.length >= 3){
      this.showSearching = true;
      this.searchResults = await this.VariantService.getSearchData(this.search);
    }
  }

  async getData(){
      var effect;
      var biotype;
      console.log("Esto =>" + this.geneSelection);
      effect = await this.VariantService.getTermsData();
      effect.forEach(element => {
        this.effects.push({label: element.displayName, value: element.term})
      });
      biotype = await this.VariantService.getBiotypeData();
      biotype.sort().forEach(element => {
        this.biotypes.push({label: element, value: element});
      });
 
      
    }

}


