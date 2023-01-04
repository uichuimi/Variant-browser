import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { Impact } from "../../services/api/varcan-service/models/response/Impact";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { VariantLineDatasourceService } from "../../services/data-source/variant-line/variant-line-datasource.service";
import { VariantLine } from "../../models/table/VariantLine";
import { Sort } from "@angular/material/sort";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MatPaginator } from "@angular/material/paginator";
import { Subject, tap } from "rxjs";
import { TableHeaderMeta } from "../../models/table/TableHeaderMeta";



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
export class TableComponent implements OnInit, AfterViewInit {
  protected page: number = 0;
  protected size: number = 10;
  protected columnsToDisplay: Array<TableHeaderMeta>;
  protected displayedColumns: Array<string>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  protected onFilterChangeEvent: Subject<any> = new Subject<any>();
  showVariantFilters: boolean;

  constructor(protected dataSource: VariantLineDatasourceService) {
    this.columnsToDisplay = [
      { name: "id", label: "ID", visualize: false },
      { name: "snpId", label: "SNP ID", visualize: true },
      { name: "region", label: "Region", visualize: true },
      { name: "allele", label: "Allele", visualize: true },
      { name: "gene", label: "Gene", visualize: true },
      { name: "effect", label: "Effect", visualize: true },
      { name: "impact", label: "Impact", visualize: true },
      { name: "frequency", label: "Frequency (GC)", visualize: true },
      { name: "gmaf", label: "Global Minor Allele Frequency (GMAF)", visualize: true },
      { name: "dp", label: "Total Depth (DP)", visualize: true }
    ];
    this.loadColumnVisualization()
  }

  async ngOnInit() {
    this.dataSource.addPropertyFilter("size", this.size);
    this.dataSource.addPropertyFilter("page", this.page);
    await this.dataSource.updateVariantLine();
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(
      tap(() => this.loadVariantPage())
    ).subscribe();
  }

  private loadColumnVisualization() {
    this.displayedColumns = this.columnsToDisplay
      .filter((column: TableHeaderMeta) => column.visualize)
      .map((column: TableHeaderMeta) => column.name);
  }

  private async loadVariantPage() {
    this.page = this.paginator.pageIndex;
    this.size = this.paginator.pageSize;
    this.dataSource.addPropertyFilter("page", this.page);
    this.dataSource.addPropertyFilter("size", this.size);
    await this.dataSource.updateVariantLine();
  }

  getTooltip(column: string, line: VariantLine) {
    return line[column];
  }

  onFilterChange($event: KeyboardEvent) {
    this.onFilterChangeEvent.next($event);
  }

  onColumnVisualizationChange($event: Array<TableHeaderMeta>) {
    this.columnsToDisplay = $event;
    this.loadColumnVisualization();
  }

  sortData($event: Sort) {
    this.dataSource.sortData($event);
  }

  drop($event: CdkDragDrop<Array<string>, any>) {
    if ($event.previousContainer === $event.container) {
      moveItemInArray(this.displayedColumns, $event.previousIndex, $event.currentIndex);
    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex,
      );
    }
    this.rearrangeColumnsMeta($event.previousIndex, $event.currentIndex);
  }
  private rearrangeColumnsMeta(previousIndex: number, currentIndex: number): void {
    const previousMetaIndex: number = this.columnsToDisplay
      .findIndex((column: TableHeaderMeta) => column.name === this.displayedColumns[previousIndex]);
    const currentMetaIndex: number = this.columnsToDisplay
      .findIndex((column: TableHeaderMeta) => column.name === this.displayedColumns[currentIndex]);
    moveItemInArray(this.columnsToDisplay, previousMetaIndex, currentMetaIndex);
  }
}
