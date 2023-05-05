import { Component, Input } from "@angular/core";
import { FrequencyLine } from "../../services/data-source/models/frequency-line";

@Component({
  selector: 'app-variant-frequency-table',
  templateUrl: './variant-frequency-table.component.html',
  styleUrls: ['./variant-frequency-table.component.css'],
})
export class VariantFrequencyTableComponent {
  @Input()
  frequencies: Array<FrequencyLine>;
  frequencyColumns: any[] = [
    {name: 'code', label: 'Population code'},
    {name: 'population', label: 'Population'},
    {name: 'frequency', label: 'Frequency'}
  ];

  onSort($event: any) {
    this.frequencies = this.sortFrequencies(this.frequencies, $event.field, $event.order);
  }

  private sortFrequencies(frequencies: FrequencyLine[], field: string, order: number) {
    return frequencies.sort((a, b) => {
      let x;
      let y;
      if (field === 'frequency') {
        const x_match = a[a.code].match(/\(([\d.]+)%\)/);
        const y_match = b[b.code].match(/\(([\d.]+)%\)/);
        x = x_match ? parseInt(x_match[1]) : 0;
        y = y_match ? parseInt(y_match[1]) : 0;
      } else {
        x = a[field];
        y = b[field];
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
