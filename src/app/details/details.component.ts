import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() selected: any;
  populations: any[] = []; 

  constructor() { 
    this.populations = [
      {name: 'African', code: 'AFR'},
      {name: 'American', code: 'AMR'},
      {name: 'Ashkenazi Jewish', code: 'ASJ'},
      {name: 'East Asian', code: 'EAS'},
      {name: 'European', code: 'EUR'},
      {name: 'Finnish', code: 'FIN'},
      {name: 'Non-Finnish European', code: 'NFE'},
      {name: 'Other', code: 'OTH'},
      {name: 'South Asian', code: 'SAS'},
    ];
  }

  ngOnInit(): void {
  }
}
