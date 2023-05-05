import { Component, Input, OnInit } from "@angular/core";
import { GenotypeLine } from "../../services/data-source/models/genotype-line";
import { VariantLine } from "../../services/data-source/models/variant-line";
import { SortEvent } from "primeng/api";

@Component({
  selector: 'app-variant-genotype-table',
  templateUrl: './variant-genotype-table.component.html',
  styleUrls: ['./variant-genotype-table.component.css'],
})
export class VariantGenotypeTableComponent implements OnInit {
  @Input()
  genotypes: Array<GenotypeLine>;
  @Input()
  variant: VariantLine;
  protected readonly Object = Object;
  protected genotypeColumns: any[] = [
    {name: 'individual', label: 'Sample'},
    {name: 'alleles', label: 'Alleles'},
    {name: 'genotype', label: 'Genotype'},
    {name: 'count', label: 'Counts'},
    {name: 'dp', label: 'DP'}
  ];
  genotypeOptions: any[];
  _selectedGenotypesOptions: any[];
  _selectedGenotypes: any[];

  ngOnInit(): void {
    this.genotypeOptions = this.genotypes
      .map(genotype => {
        return { value: genotype.individual, label: genotype.individual };
      });
    this._selectedGenotypesOptions = this.genotypeOptions;
  }

  @Input() get selectedGenotypesOption(): any[] {
    return this._selectedGenotypesOptions;
  }

  set selectedGenotypesOption(val: any[]) {
    this._selectedGenotypesOptions = this.genotypeOptions
      .filter((col) => val.includes(col));
    this._selectedGenotypes = this.genotypes
      .filter(col => val['name'] === col.individual);
  }

  get selectedGenotypes(): any[] {
    return this._selectedGenotypes;
  }

  onSort($event: SortEvent) {
    this.genotypes = this.sortGenotypes(this.genotypes, $event.field, $event.order);
  }

  private sortGenotypes(genotypes: GenotypeLine[], field: string, order: number): GenotypeLine[] {
    return genotypes.sort((a, b) => {
      let x;
      let y;
      if (field !== 'counts') {
        x = this.getGenotypeCounts(a);
        y = this.getGenotypeCounts(b);
      } else if (field.includes('dp (')) {
        x = this.getGenotypeDP(a);
        y = this.getGenotypeDP(b);
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

  getGenotypeCounts(genotype: GenotypeLine) {
    const alleles = this.variant.allele.split('|');
    return `${alleles[0]}=${genotype.refCount}, ${alleles[1]}=${genotype.altCount}`;
  }

  getGenotypeDP(genotype: GenotypeLine) {
    const fieldKey = `DP (${genotype.individual})`;
    return genotype[fieldKey];
  }
}
