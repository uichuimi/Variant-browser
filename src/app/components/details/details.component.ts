import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() selected: any;
  @Output() closeDetails = new EventEmitter;
  populations: any[] = [];
  noDetails: boolean = false;

  constructor() {
    this.populations = [
      { name: 'African', code: 'AFR' },
      { name: 'American', code: 'AMR' },
      { name: 'Ashkenazi Jewish', code: 'ASJ' },
      { name: 'East Asian', code: 'EAS' },
      { name: 'European', code: 'EUR' }, //QUITAR AL FINAL?
      { name: 'Finnish', code: 'FIN' },
      { name: 'Non-Finnish European', code: 'NFE' },
      { name: 'Other', code: 'OTH' },
      { name: 'South Asian', code: 'SAS' },
    ];
  }

  ngOnInit(): void {
  }

  closeTag() {
    this.noDetails = true;
    this.closeDetails.emit(this.noDetails);
    this.selected = undefined;
  }
}