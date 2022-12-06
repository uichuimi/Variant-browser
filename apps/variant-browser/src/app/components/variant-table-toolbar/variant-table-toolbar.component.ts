import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { VariantLineDatasourceService } from "../../services/data-source/variant-line/variant-line-datasource.service";
import { TableHeaderMeta } from "../../models/table/TableHeaderMeta";

@Component({
  selector: 'app-variant-table-toolbar',
  templateUrl: './variant-table-toolbar.component.html',
  styleUrls: ['./variant-table-toolbar.component.css'],
})

export class VariantTableToolbarComponent implements OnInit {
  @Input() onFilterChangeEvent: Subject<any>;
  @Input() columnsToDisplay: Array<TableHeaderMeta>;
  @Output() columnVisualizationChangeEvent: EventEmitter<Array<TableHeaderMeta>>;
  allChecked: boolean = false;

  constructor(protected dataSource: VariantLineDatasourceService) {
    this.columnVisualizationChangeEvent = new EventEmitter<Array<TableHeaderMeta>>();
  }
  ngOnInit(): void {
    this.onFilterChangeEvent.subscribe(e => {
      this.applyFilter(e);
    });
  }

  ngOnDestroy() {
    this.onFilterChangeEvent.unsubscribe();
  }

  applyFilter($event: KeyboardEvent) {
    const pressedBackspace = $event.key === 'Backspace';
    const filterValue:string = ($event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filterData(filterValue, pressedBackspace);
  }

  setAll(checked: boolean) {
    this.allChecked = checked;
    this.columnsToDisplay
      .forEach((field: TableHeaderMeta) => field.visualize = checked);
    this.columnVisualizationChange(this.columnsToDisplay);
  }

  updateAllComplete() {
    this.allChecked = this.columnsToDisplay
      .every((field: TableHeaderMeta) => field.visualize);
    this.columnVisualizationChange(this.columnsToDisplay);
  }

  someComplete(): boolean {
    let checkedFields: Array<TableHeaderMeta> = this.columnsToDisplay
      .filter((column: TableHeaderMeta) => column.visualize);
    return checkedFields.length > 0 && !this.allChecked;
  }

  columnVisualizationChange(value: Array<TableHeaderMeta>) {
    this.columnVisualizationChangeEvent.emit(value);
  }
}
