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

  //Array needed for the table in the Details table
  constructor() {
    this.populations = [
      { name: 'African', code: 'AFR' },
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