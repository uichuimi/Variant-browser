import {Component, EventEmitter, OnDestroy, OnInit} from "@angular/core";
import {faCodeCompare, faHashtag, faLayerGroup, faPeopleGroup, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Filter} from "../../models/event-object/filter";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {Population} from "../../services/api/varcan-service/models/response/Population";
import {GlobalConstants} from "../../services/common/global-constants";
import {ScreenBreakpointAttributeValue} from "../../directives/device-width-breakpoint.directive";
import {VariantLineDatasourceService} from "../../services/data-source/variant-line/variant-line-datasource.service";
import {FrequencyFilterParams} from "../../services/api/varcan-service/models/request/frequency-filter-params";

@Component({
  selector: 'app-frequency-filter',
  templateUrl: './frequency-filter.component.html',
  styleUrls: ['./frequency-filter.component.css'],
})
export class FrequencyFilterComponent implements OnInit, OnDestroy {
  protected readonly faHashtag = faHashtag;
  protected readonly faPeopleGroup: IconDefinition = faPeopleGroup;
  protected readonly faCodeCompare: IconDefinition = faCodeCompare;
  protected readonly faLayerGroup: IconDefinition = faLayerGroup;
  protected deviceBreakpointToggle: ScreenBreakpointAttributeValue = {
    lg: "horizontal",
    xl: "horizontal",
    default: "vertical"
  };
  protected layout: string = this.deviceBreakpointToggle.default;
  protected appDeviceWidthBreakpointEvent: EventEmitter<string> = new EventEmitter<string>();
  protected frequencyFilterForm: FormGroup;
  protected filter: Filter;
  protected allArityOperators: Array<object> = [
    { code: "ANY", label: "Any" },
    { code: "ALL", label: "All" },
    { code: "NONE", label: "None" }
  ];
  protected selectedArityOperators: Array<string>;
  protected allPopulations: Array<object>;
  protected selectedPopulations: Array<number>;
  protected allNumericalComparators: Array<object> = [
    { code: "lt", label: "Less than (<)" },
    { code: "le", label: "Less than or equal (≤)" },
    { code: "eq", label: "Equals (=)" },
    { code: "nq", label: "Non equals (≠)" },
    { code: "ge", label: "Greater than or equal (≥)" },
    { code: "gt", label: "Greater than (>)" },
  ];
  protected selectedNumericalComparators: Array<string>;
  protected af: number;

  constructor(private fb: FormBuilder, private globalConstant: GlobalConstants,
              private dataSource: VariantLineDatasourceService) {
    this.frequencyFilterForm = fb.group({
      frequencyFilters: fb.group({
        arity: fb.control("", [Validators.required]),
        population: fb.control([], [Validators.required]),
        operation: fb.control("", [Validators.required]),
        af: fb.control(null,
          [Validators.required, Validators.min(0.0), Validators.max(1.0)])
      })
    })
    this.allPopulations = this.globalConstant.getPopulation().map(population => {
      return {
        name: `${population.name} (${population.code})`,
        code: population.id
      }
    });
  }

  ngOnInit(): void {
    this.appDeviceWidthBreakpointEvent.subscribe((value) => {
      this.layout = this.getLayout(value);
    });
  }

  ngOnDestroy(): void {
    this.appDeviceWidthBreakpointEvent.unsubscribe();
  }

  private getLayout(value: string): string {
    if (Object.keys(this.deviceBreakpointToggle).includes(value)) {
      return this.deviceBreakpointToggle[value];
    } else {
      return this.deviceBreakpointToggle.default;
    }
  }

  get arityCtrl(): FormControl {
    return this.frequencyFilterForm.get("frequencyFilters.arity") as FormControl;
  }

  get populationCtrl(): FormControl {
    return this.frequencyFilterForm.get("frequencyFilters.population") as FormControl;
  }

  get operationCtrl(): FormControl {
    return this.frequencyFilterForm.get("frequencyFilters.operation") as FormControl;
  }

  get afCtrl(): FormControl {
    return this.frequencyFilterForm.get("frequencyFilters.af") as FormControl;
  }

  protected async onSubmit() {
    if (this.frequencyFilterForm.valid) {
      console.log(this.frequencyFilterForm.value)
      const population: Array<number> = this.frequencyFilterForm.value.frequencyFilters.population;
      const frequencyFilter: FrequencyFilterParams[] = this.getFrequencyFilterRequest(population);
      this.dataSource.addFrequencyFilter(frequencyFilter);
      this.addNewFilterItem();
      await this.dataSource.updateVariantLine();
    } else {
      console.error("Invalid submission: ", this.frequencyFilterForm.value);
    }
  }

  private getFrequencyFilterRequest(population: Array<number>) {
    return population.map(populationId => {
      return {
        arity: this.frequencyFilterForm.value.frequencyFilters.arity,
        population: populationId,
        operation: this.frequencyFilterForm.value.frequencyFilters.operation,
        af: this.frequencyFilterForm.value.frequencyFilters.af
      };
    });
  }

  async onDeleteFilter($event: Filter) {
    const propertyName: string = $event.name;
    const propertyValue: any = $event.value;
    const frequencyFilterForm = this.generateTargetFilter($event);
    const targetFrequencyFilter: FrequencyFilterParams[] = this.getFrequencyFilterRequest(frequencyFilterForm.population.split(","));
    this.dataSource.deleteFrequencyFilter(targetFrequencyFilter);
    await this.dataSource.updateVariantLine();
  }

  protected readonly faPlus = faPlus;

  private addNewFilterItem() {
    const frequencyFilters = this.frequencyFilterForm.value.frequencyFilters;
    this.filter = {
      name: "arity,population,operation,af",
      value: `${frequencyFilters.arity} ${frequencyFilters.population} ${frequencyFilters.operation} ${frequencyFilters.af}`,
      filterString: "",
      attributes: []
    }


    this.addFilterAttribute(frequencyFilters.arity, "chip");
    this.addFilterAttribute("of", "text");
    this.addFilterAttribute(frequencyFilters.operation, "chip");
    this.addFilterAttribute(frequencyFilters.af, "chip");
    this.addFilterAttribute("from", "text");
    const populationNames = this.getPopulationNames(frequencyFilters.population);
    this.addFilterAttribute(`[${populationNames}]`, "chip");
  }

  private addFilterAttribute(value: any, type: string) {
    let filterStr: string = `${value} `;
    this.filter.attributes.push(
      {
        filter: value,
        type: type
      }
    );
    this.filter.filterString += filterStr;
  }

  private getPopulationNames(populationIds: Array<number>) {
    console.log(populationIds);
    console.log(this.allPopulations);
    return populationIds.map((populationId: number) => {
      const population = this.globalConstant.getPopulation()
        .find((population: Population) => population.id === populationId);
      console.log(population);
      return population['code'];
    });
  }

  private generateTargetFilter(filter: Filter) {
    const params = filter.value.split(" ");
    return {
      arity: params[0],
      population: params[1],
      operation: params[2],
      af: Number.parseFloat(params[3])
    };
  }
}
