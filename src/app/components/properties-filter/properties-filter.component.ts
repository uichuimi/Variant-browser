import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

// CONSTANTS
import { GlobalConstants } from 'src/app/common/global-constants';

// MODELS
import { Chromosome } from 'src/app/models/output/Chromosome';
import { Effect } from 'src/app/models/output/Effect';
import { Impact } from 'src/app/models/output/Impact';
import { Biotype } from 'src/app/models/output/Biotype';

@Component({
  selector: 'app-properties-filter',
  templateUrl: './properties-filter.component.html',
  styleUrls: ['./properties-filter.component.css']
})
export class PropertiesFilterComponent implements OnInit {
  fieldOptions: Array<Object> = [
    { type: 'number', name: 'Start' },
    { type: 'number', name: 'End' },
    { type: 'number', name: 'GMAF' },
    { type: 'number', name: 'Polyphen' },
    { type: 'number', name: 'Sift' },
    { type: 'list', name: 'Chromosomes' },
    { type: 'list', name: 'Genes' },
    { type: 'list', name: 'Effects' },
    { type: 'list', name: 'Impacts' },
    { type: 'list', name: 'Biotypes' },
    { type: 'list', name: 'Identifiers' }
  ];

  chromosomesList: Chromosome[];
  chromosomeSettings: IDropdownSettings = {};
  selectedChromosomes = [];

  effectsList: Effect[];
  effectSettings: IDropdownSettings = {};
  selectedEffects = [];

  impactsList: Impact[];
  impactSettings: IDropdownSettings = {};
  selectedImpacts = [];

  biotypesList: Biotype[];
  biotypeSettings: IDropdownSettings = {};
  selectedBiotypes = [];  

  ngOnInit(): void {
    this.chromosomesList = GlobalConstants.getChromosomes();
    this.effectsList = GlobalConstants.getEffects();
    this.impactsList = GlobalConstants.getImpacts();
    this.biotypesList = GlobalConstants.getBiotypes();
    this.chromosomeSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'ucsc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true       
    };
    this.effectSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'description',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true       
    };  
    this.impactSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false       
    };  
    this.biotypeSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true       
    };          
  }

  addFilter(propertiesFilter) {
    console.log("propertiesFilter: ", propertiesFilter);
  }
}
