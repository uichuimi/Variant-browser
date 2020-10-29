import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() selected: any;
  populations: any = ["African", "American", "Ashkenazi Jewish", "East Asian", "European", "Finnish", "Other", "South Asian"];
  constructor() { }

  ngOnInit(): void {
  }

 
}
