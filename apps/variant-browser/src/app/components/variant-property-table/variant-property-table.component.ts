import { Component, Input } from "@angular/core";
import { VariantLine } from "../../services/data-source/models/variant-line";

@Component({
  selector: 'app-variant-property-table',
  templateUrl: './variant-property-table.component.html',
  styleUrls: ['./variant-property-table.component.css'],
})
export class VariantPropertyTableComponent {
  @Input()
  variant: VariantLine;
  protected readonly Object = Object;
  propertyColumns: any[] = [
    {name: 'name', label: 'Property name'},
    {name: 'value', label: 'Property value'}
  ];

  onSort($event: any) {
    const sorted_key_value = this.sortVariant(Object.entries(this.variant),
      $event.field, $event.order);
    this.variant = sorted_key_value.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    return sorted_key_value;
  }

  protected isMainVariantProperty(variant_key: string) {
    return !['frequencies', 'genotypes', 'consequences'].includes(variant_key);
  }

  private sortVariant(variants: any[][], field: any, order: number) {
    return variants.sort((a, b) => {
      if (field === 'name') field = 0;
      else field = 1;

      let x = a[field];
      let y = b[field];

      if (typeof x === 'number') {
        x = x.toString();
      }
      if (typeof y === 'number') {
        y = y.toString();
      }
      if (typeof x === 'string') {
        x = x.toLowerCase();
      }
      if (typeof y === 'string') {
        y = y.toLowerCase();
      }

      if (x < y) {
        return order === -1 ? 1 : -1;
      } else if (x > y) {
        return order === -1 ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
}
