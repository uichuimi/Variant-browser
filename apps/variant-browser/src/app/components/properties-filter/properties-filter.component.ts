import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IDropdownSettings} from 'ng-multiselect-dropdown';

import {VariantParams} from '../../models/input/VariantParams';
import {Page} from '../../models/output/Page';
import {AxiosResponse} from 'axios';
import { Chromosome } from "../../models/output/Chromosome";
import { Effect } from "../../models/output/Effect";
import { Impact } from "../../models/output/Impact";
import { Biotype } from "../../models/output/Biotype";
import { VarCanService } from "../../services/varcan-service/var-can.service";
import { GlobalConstants } from "../../common/global-constants";
import { Gene } from "../../models/output/Gene";

@Component({
  selector: 'app-properties-filter',
  templateUrl: './properties-filter.component.html',
  styleUrls: ['./properties-filter.component.css']
})
export class PropertiesFilterComponent implements OnInit {
  private appliedFilters: VariantParams = {};

  private visibleDropListOptionIds = {
    chromosomes: 'ucsc',
    effects: 'description',
    impacts: 'name',
    biotypes: 'name'
  };

  fieldOptions: Array<object> = [
    { type: 'number', name: 'Start' },
    { type: 'number', name: 'End' },
    { type: 'number', name: 'GMAF' },
    { type: 'number', name: 'Polyphen' },
    { type: 'number', name: 'Sift' },
    { type: 'list', name: 'Chromosomes' },
    { type: 'list', name: 'Effects' },
    { type: 'list', name: 'Impacts' },
    { type: 'list', name: 'Biotypes' },
    { type: 'id', name: 'Genes' },
    { type: 'id', name: 'Identifiers' }
  ];
  appliedFiltersList: any = {};

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

  // OUTPUT EVENTS
  @Output() resetPageEvent = new EventEmitter();
  @Output() notifyFilterEvent = new EventEmitter();

  constructor(private service: VarCanService, private globalConstants: GlobalConstants) {
  }

  ngOnInit(): void {
    this.chromosomesList = this.globalConstants.getChromosomes();
    this.effectsList = this.globalConstants.getEffects();
    this.impactsList = this.globalConstants.getImpacts();
    this.biotypesList = this.globalConstants.getBiotypes();

    this.chromosomeSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'ucsc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      enableCheckAll: true
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
    this.getAllFilters();
  }

  async addFilter(propertiesFilter) {
    const { field, operator, value } = propertiesFilter.value;
    const fieldName = field.name.toLowerCase();

    if (field.type === 'list') {
      this.createFilterDropdownList(fieldName, field, operator, value);
    } else if (field.type === 'number') {
      this.createFilterDropdownNumber(fieldName, field, operator, value);
    } else if (field.type === 'id') {
      await this.createFilterDropdownId(fieldName, field, operator, value);
    }

    // PERSISTIR FILTROS
    localStorage.setItem('allFilters', JSON.stringify(this.appliedFiltersList));

    // OBTENER TODOS LOS FILTROS
    this.getAllFilters();

    this.notifyFilterEvent.emit(this.appliedFilters);
    this.resetPageEvent.emit();
  }

  removeFilter(key) {
    const fieldNameUpperCase = key.charAt(0).toUpperCase() + key.substr(1);
    console.log('remove: ' + key);
    delete this.appliedFilters[key];
    delete this.appliedFiltersList[key];
    this['selected' + fieldNameUpperCase] = [];

    if (this.appliedFiltersList.length === 0) {
      localStorage.removeItem('allFilters');
    } else {
      localStorage.setItem('allFilters', JSON.stringify(this.appliedFiltersList));
    }

    this.notifyFilterEvent.emit(this.appliedFilters);
    this.resetPageEvent.emit();
  }

  private createFilterDropdownList(fieldName: string, field: any, numericOperator: any, value: any) {
    const identifierName = this.visibleDropListOptionIds[fieldName];

    const ids: Set<number> = new Set([]);
    const names: Set<string> = new Set([]);
    value.map(val => {
      ids.add(val.id);
      names.add(val[identifierName]);
    });

    this.appliedFilters = {...this.appliedFilters, [fieldName]: [...ids]};
    this.appliedFiltersList = {
      ...this.appliedFiltersList,
      [fieldName]: {inputType: field.type, values: [...names]}
    };
  }

  private createFilterDropdownNumber(fieldName: string, field: any, numericOperator: any, numericValue: number) {
    this.appliedFilters = {...this.appliedFilters, [fieldName]: numericValue};
    this.appliedFiltersList = {
      ...this.appliedFiltersList,
      [fieldName]: {inputType: field.type, operator: numericOperator, value: numericValue}
    };
  }

  private async createFilterDropdownId(fieldName: string, field: any, numericOperator: any, value: any) {
    let identifierValues = value.replaceAll(/\s/g, '').split(',');
    identifierValues = [...new Set(identifierValues)];
    let identifiers = [];

    if (fieldName === 'genes') {
      const genePromises = identifierValues.map(gene => this.service.getGenes({search: gene}));
      await Promise.all(genePromises).then(responses => {
        responses.map((response: AxiosResponse<Page<Gene>>) => {
          identifiers.push.apply(identifiers, response.data.content.map(gene => gene.id));
        });
      });
    } else {
      identifiers = identifierValues;
    }

    this.appliedFilters = {...this.appliedFilters, [fieldName]: identifiers};
    this.appliedFiltersList = {
      ...this.appliedFiltersList,
      [fieldName]: {inputType: field.type, values: identifierValues}
    };
  }

  getAllFilters() {
    this.appliedFiltersList = JSON.parse(localStorage.getItem('allFilters'));
  }
  /*   getAppliedFiltersLength() {
      return Object.keys(this.appliedFilters).length;
    } */
}
