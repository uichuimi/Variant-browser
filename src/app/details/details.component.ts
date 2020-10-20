import { Component, OnInit, Input } from '@angular/core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() selected: any;
  faCircle = faCircle;
  constructor() { }

  ngOnInit(): void {
  }

 
}
