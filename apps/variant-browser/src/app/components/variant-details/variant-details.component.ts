import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Variant} from '../../models/output/Variant';

@Component({
  selector: 'app-variant-line-details',
  templateUrl: './variant-details.component.html',
  styleUrls: ['./variant-details.component.css']
})
export class VariantDetailsComponent implements OnInit, OnChanges {

  @Input() variant: Variant;

  data = [
    {
      id: 1,
      value: 'hola'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('HOLA VARIANTE', this.variant, changes);
  }

}
