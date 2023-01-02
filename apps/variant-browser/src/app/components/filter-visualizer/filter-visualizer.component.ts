import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Filter } from "../../models/event-object/filter";

@Component({
  selector: "app-filter-visualizer",
  templateUrl: "./filter-visualizer.component.html",
  styleUrls: ["./filter-visualizer.component.css"]
})
export class FilterVisualizerComponent implements OnChanges {
  @Input() filter: Filter;
  @Output() deleteFilter: EventEmitter<Filter>;
  @ViewChild("orderList") orderList;
  protected allFilters: Array<Filter>;
  protected faTrash: IconDefinition = faTrash;
  protected values: Array<object>;

  constructor() {
    this.allFilters = new Array<Filter>();
    this.deleteFilter = new EventEmitter<Filter>();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.filter.firstChange) {
      this.filter = changes.filter.currentValue;
      this.allFilters = [...this.allFilters, this.filter];
      this.allFilters = this.getUniqueListOfFilters();
    }
  }

  onDeleteFilter(item: Filter) {
    const indexRemove = this.allFilters.indexOf(item);
    if (indexRemove >= 0) {
      const deletedFilter: Filter = this.allFilters.splice(indexRemove, 1)[0];
      this.deleteFilter.emit(deletedFilter);
    }
  }

  private getUniqueListOfFilters() {
    return this.allFilters
      .filter((value: Filter, index: number, array: Filter[]) => {
        return array.map((filter: Filter) => filter.filterString)
          .indexOf(value.filterString) == index;
      });
  }
}
