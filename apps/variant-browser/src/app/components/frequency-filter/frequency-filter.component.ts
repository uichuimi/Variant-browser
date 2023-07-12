import { Component, EventEmitter } from "@angular/core";
import {  } from "@fortawesome/free-solid-svg-icons";
import { FormGroup } from "@angular/forms";
import { Filter } from "../../models/event-object/filter";

@Component({
  selector: 'app-frequency-filter',
  templateUrl: './frequency-filter.component.html',
  styleUrls: ['./frequency-filter.component.css'],
})
export class FrequencyFilterComponent {
  layout: string;
  protected appDeviceWidthBreakpointEvent: EventEmitter<string> = new EventEmitter<string>();
  frequencyFilterForm: FormGroup;
  filter: Filter;

  protected async onSubmit() {

  }

  onDeleteFilter($event: Filter) {

  }
}
