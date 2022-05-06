import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
  }

  addFilter(propertiesFilter) {
    console.log("propertiesFilter: ", propertiesFilter.value.field.type);
  }
}
