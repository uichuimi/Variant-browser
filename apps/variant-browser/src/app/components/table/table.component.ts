import { Component, OnInit, ViewChild } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { GlobalConstants } from "../../services/common/global-constants";
import { VarcanService } from "../../services/api/varcan-service/varcan.service";
import { VariantParams } from "../../services/api/varcan-service/models/request/VariantParams";
import { Paginator } from "primeng/paginator";
import { VariantLineDatasourceService } from "../../services/data-source/variant-line/variant-line-datasource.service";
import { VariantLine } from "../../services/data-source/models/variant-line";



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
  protected variants: Array<VariantLine>;
  protected showVariantFilters: boolean;
  protected variantParams: VariantParams;
  protected first: number = 0;
  protected rows: number = 5;
  @ViewChild('paginator', {static: true}) paginator: Paginator;

  constructor(private readonly service: VarcanService,
              private readonly globalConstants: GlobalConstants,
              protected dataSource: VariantLineDatasourceService) {
    this.variantParams = { size: this.rows };
    this.globalConstants.initializeLocalStorage();
  }

  ngOnInit(): void {
    this.loadVariants({ first: 0, rows: this.rows });
  }

  async loadVariants(event) {
    console.log(event, event.first / event.rows);
    this.rows = event.rows;
    this.variantParams.page = event.first / event.rows;
    this.variantParams.size = event.rows;
    this.variants = await this.dataSource.updateVariantLine(this.variantParams);
  }

  protected updateCurrentPage(currentPage: number): void {
    setTimeout(() => this.paginator.changePage(currentPage));
  }

  protected reset() {
    this.first = 0;
  }
}
