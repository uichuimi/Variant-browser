import { Component, OnInit, ViewChild } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { GlobalConstants } from "../../services/common/global-constants";
import { Variant } from "../../services/api/varcan-service/models/response/Variant";
import { VarcanService } from "../../services/api/varcan-service/varcan.service";
import { LazyLoadEvent } from "primeng/api";
import { VariantParams } from "../../services/api/varcan-service/models/request/VariantParams";
import { Paginator } from "primeng/paginator";



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class TableComponent implements OnInit {
  protected variants: Array<Variant>;
  protected totalRecords: number;
  protected loading: boolean;
  protected showVariantFilters: boolean;
  protected variantParams: VariantParams;
  protected first: number = 0;
  protected rows: number = 10;
  @ViewChild('paginator', {static: true}) paginator: Paginator;

  constructor(private service: VarcanService, private globalConstants: GlobalConstants) {
    this.variantParams = { size: 100 };
    this.globalConstants.initializeLocalStorage();
  }

  ngOnInit() {
    this.loading = true;
  }
  loadVariants(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.service.getVariants(this.variantParams).then(res => {
        this.variants = res.data.content.map(this.markNullValues());
        if (event.sortField != null && event.sortOrder != 0) {
          this.sortData(event, event.sortField, event.sortOrder);
        }
        this.totalRecords = res.data.totalElements;
        this.loading = false;
      })
    }, 1000)
  }

  private markNullValues() {
    return (variant: Variant) => {
      Object.keys(variant).forEach((field: string) => {
        if (variant[field] == null) {
          variant[field] = "-";
        }
      });
      return variant;
    };
  }

  private sortData(event: LazyLoadEvent, field: string, order: number) {
    this.variants = this.variants.sort(this.compareVariantFields(field, order));
  }

  private compareVariantFields(field: string, order: number) {
    return (a: Variant, b: Variant) => {
      if (typeof a[field] === "string" && typeof b[field] === "string") {
        return (a[field] as string).localeCompare((b[field] as string)) * order;
      } else {
        return ((a[field] as number) - (b[field] as number)) * order;
      }
    };
  }

  protected updateCurrentPage(currentPage: number): void {
    setTimeout(() => this.paginator.changePage(currentPage));
  }

  protected reset() {
    this.first = 0;
  }
}
