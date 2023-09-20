import { Component, Input, OnInit } from "@angular/core";
import { ConsequenceLine } from "../../services/data-source/models/consequence-line";

@Component({
  selector: 'app-variant-consequence-table',
  templateUrl: './variant-consequence-table.component.html',
  styleUrls: ['./variant-consequence-table.component.css'],
})
export class VariantConsequenceTableComponent implements OnInit{
  @Input()
  consequences: Array<ConsequenceLine>;
  consequenceColumns: any[] = [
    {name: 'ensg', label: 'ENSG'},
    {name: 'hgnc', label: 'HGNC'},
    {name: 'geneName', label: 'Gene name'},
    {name: 'transcript', label: 'ENST'},
    {name: 'impact', label: 'Impact'},
    {name: 'biotypeAccession', label: 'Biotype accession'},
    {name: 'biotypeName', label: 'Biotype name'},
    {name: 'biotypeDescription', label: 'Biotype description'},
    {name: 'effectAccession', label: 'Effect accession'},
    {name: 'effectName', label: 'Effect name'},
    {name: 'effectDescription', label: 'Effect description'},
    {name: 'hgvsp', label: 'HGVSP'},
    {name: 'ncbi', label: 'NCBI'},
    {name: 'polyphen', label: 'Polyphen'},
    {name: 'sift', label: 'SIFT'}
  ];
  _selectedColumns: any[];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.consequenceColumns.filter((col) => val.includes(col));
  }

  onSort($event: any) {
    this.consequences = this.sortConsequences(this.consequences, $event.field, $event.order);
  }

  protected readonly Object = Object;

  ngOnInit(): void {
    this._selectedColumns = this.consequenceColumns
      .filter(col => ['ensg', 'biotypeName', 'effectName', 'impact', 'transcript'].includes(col.name))
  }

  private sortConsequences(consequences: ConsequenceLine[], field: string, order: number) {
    return consequences.sort((a, b) => {
      let x = a[field];
      let y = b[field];
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
