import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

// CONSTANTS
import { GlobalConstants } from 'src/app/common/global-constants';

// MODELS
import { Chromosome } from 'src/app/models/output/Chromosome';
import { Effect } from 'src/app/models/output/Effect';
import { Impact } from 'src/app/models/output/Impact';
import { Biotype } from 'src/app/models/output/Biotype';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';
import { Gene } from 'src/app/models/output/Gene';

@Component({
  selector: 'app-properties-filter',
  templateUrl: './properties-filter.component.html',
  styleUrls: ['./properties-filter.component.css']
})
export class PropertiesFilterComponent implements OnInit {
  private service: VarCanService;
  appliedFilters: Object = {};

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
  
  genesList: Gene[];
  geneSettings: IDropdownSettings = {};
  selectedGenes = [];

  // OUTPUT EVENTS
  @Output() resetPageEvent = new EventEmitter();
  @Output() notifyFilterEvent = new EventEmitter();  
  @Output() notifyIdentifierFilterEvent = new EventEmitter();

  ngOnInit(): void {
    this.service = GlobalConstants.getService();
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
      allowSearchFilter: false       
    }; 
    this.geneSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'symbol',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      allowRemoteDataSearch: true
    };    
    this.getAllFilters();  
  }

  addFilter(propertiesFilter) {
    const { field, operator, value } = propertiesFilter.value;
    var props = this;   // REFERENCIA A PROPIEDADES DE LA CLASE;
    var filterCreator;  // LÓGICA PARA CREAR BODY DE LLAMADA POST /VARIANTS

    var fieldName = field.name;
    var fieldNameLowerCase = fieldName.toLowerCase();
    
    var name = {
      'Chromosomes': 'ucsc',
      'Genes': 'symbol',
      'Effects': 'description',
      'Impacts': 'name',
      'Biotypes': 'name',
      'Identifiers': ''  
    }
    var identifierName = name[fieldName];   // OBTENER NOMBRE DE LA PROPIEDAD QUE IDENTIFICA CADA TIPO DE DATO

    if(field.type === 'list') {
      filterCreator = {
        [fieldName]: function(props) {
          var ids = new Set([]);
          var names = new Set([]);
          value.map(val => {
            ids.add(val.id);
            names.add(val[identifierName]);
          });
          
          let filters = {...props.appliedFilters, [fieldNameLowerCase]: [...ids]};
          let filtersList = {
            ...props.appliedFiltersList, 
            [fieldNameLowerCase]: {'inputType': 'list', 'values': [...names]}
          };
          return { filters, filtersList };
        }
      }
    } else if(field.type === 'number') {
      filterCreator = {
        [fieldName]: function(props) {
          let filters = {...props.appliedFilters, [fieldNameLowerCase]: value};
          let filtersList = {
            ...props.appliedFiltersList, 
            [fieldNameLowerCase]: {'inputType': 'number', 'operator': operator, 'value': value}
          };
          return { filters, filtersList };
        }
      }
    } else if(field.type === 'id') {
      filterCreator = {
        'Identifiers': function(props) {
          let identifiersArray = value.split(",");
          let filters = {"identifiers": identifiersArray};
          let filtersList = {"identifiers": {'inputType': 'list', 'values': identifiersArray}};
          props.notifyIdentifierFilterEvent.emit();
          return { filters, filtersList };          
        }
      }
    }
    
    console.log("fieldName (fuera): " + fieldName);
    this.appliedFilters = filterCreator[fieldName](props).filters;
    this.appliedFiltersList = filterCreator[fieldName](props).filtersList;

    // PERSISTIR FILTROS
    localStorage.setItem("allFilters", JSON.stringify(this.appliedFiltersList));  
    
    // OBTENER TODOS LOS FILTROS
    this.getAllFilters();

    console.log("appliedFilters: ", this.appliedFilters);
    console.log("appliedFiltersList: ", this.appliedFiltersList);
    this.notifyFilterEvent.emit(this.appliedFilters);
    this.resetPageEvent.emit();
  }

  removeFilter(key) {
    console.log("remove: " + key);
    delete this.appliedFilters[key];
    delete this.appliedFiltersList[key];
    localStorage.setItem("allFilters", JSON.stringify(this.appliedFiltersList));  // ELIMINAR FILTRO DE LOCALSTORAGE
    this.notifyFilterEvent.emit(this.appliedFilters);
    this.resetPageEvent.emit();
  }  

  getGenes(data) {
    console.log("data filter gene: ", data);
    this.service.getGenes({"search": data}).then(response => {
      this.genesList = response.data.content;
      console.log("response: ", response.data);
    }).catch(error => console.log("Genes filtered by name error: " + error));
  }

  getAllFilters() {
    this.appliedFiltersList = JSON.parse(localStorage.getItem("allFilters"));
  }

/*   getAppliedFiltersLength() {
    return Object.keys(this.appliedFilters).length;
  } */
}
