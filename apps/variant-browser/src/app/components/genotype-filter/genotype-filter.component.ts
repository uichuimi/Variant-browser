import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { GenotypeFilterParams } from "../../services/api/varcan-service/models/request/GenotypeFilterParams";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { GlobalConstants } from "../../services/common/global-constants";
import { Individual } from "../../services/api/varcan-service/models/response/Individual";
import { GenotypeType } from "../../services/api/varcan-service/models/response/GenotypeType";
import { ScreenBreakpointAttributeValue } from "../../directives/device-width-breakpoint.directive";
import { faDna, faHashtag, faPeopleGroup, faPlus, faVial } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Filter } from "../../models/event-object/filter";

interface Arity {
  selector: string;
  label: string;
}

interface SampleSelectGroup {
  disabled?: boolean;
  name: string;
  value: Array<Individual>;
}

@Component({
  selector: "app-genotype-filter",
  templateUrl: "./genotype-filter.component.html",
  styleUrls: ["./genotype-filter.component.css"]
})
export class GenotypeFilterComponent implements OnInit, OnDestroy {
  number: number;
  protected faPeopleGroup: IconDefinition = faPeopleGroup;
  protected faHashtag: IconDefinition = faHashtag;
  protected faVial: IconDefinition = faVial;
  protected faDna: IconDefinition = faDna;
  protected faPlus: IconDefinition = faPlus;
  protected appDeviceWidthBreakpointEvent: EventEmitter<string> = new EventEmitter<string>();
  protected layout: string;
  protected deviceBreakpointToggle: ScreenBreakpointAttributeValue = {
    lg: "horizontal",
    xl: "horizontal",
    default: "vertical"
  };
  protected genotypeFilterForm: FormGroup;
  protected allSetOperators: Array<Arity> = [
    { selector: "ANY", label: "Any" },
    { selector: "ALL", label: "All" },
    { selector: "NONE", label: "None" }
  ];

  protected selectedSetOperators: Arity;
  protected allSamples: Array<object>;
  protected selectedSamples: Array<number> = [];
  protected allGenotypes: Array<GenotypeType>;
  protected selectedGenotypes: Array<number> = [];
  protected filter: Filter;
  private selectorCtrlEvent: Subscription;
  private genotypeFilterParams: Array<GenotypeFilterParams>;

  constructor(private fb: FormBuilder, protected globalConstants: GlobalConstants) {
    this.genotypeFilterParams = new Array<GenotypeFilterParams>();
    this.genotypeFilterForm = fb.group({
      genotypeFilters: fb.group({
        individual: fb.control([], [Validators.required]),
        genotypeType: fb.control([], [Validators.required]),
        selector: fb.control("", [Validators.required])
      })
    });

    this.allGenotypes = this.globalConstants.getGenotypeTypes();
    this.generateSampleSelectOptions();
    this.layout = this.deviceBreakpointToggle.default;
  }

  get genotypeFiltersCtrl(): FormGroup {
    return this.genotypeFilterForm.get("genotypeFilters") as FormGroup;
  }

  get selectorCtrl(): FormControl {
    return this.genotypeFilterForm.get("genotypeFilters.selector") as FormControl;
  }

  get genotypeTypeCtrl(): FormControl {
    return this.genotypeFilterForm.get("genotypeFilters.genotypeType") as FormControl;
  }

  get individualCtrl(): FormControl {
    return this.genotypeFilterForm.get("genotypeFilters.individual") as FormControl;
  }

  get numberCtrl(): FormControl {
    return this.genotypeFilterForm.get("genotypeFilters.number") as FormControl;
  }

  ngOnInit(): void {
    this.generateResponsiveNumberField();
    this.appDeviceWidthBreakpointEvent.subscribe((value) => {
      this.layout = this.getLayout(value);
    });
  }

  ngOnDestroy(): void {
    this.appDeviceWidthBreakpointEvent.unsubscribe();
    this.selectorCtrlEvent.unsubscribe();
  }

  onSubmit() {
    if (this.genotypeFilterForm.valid) {
      const genotypeFilter: GenotypeFilterParams = { ...this.genotypeFilterForm.value.genotypeFilters };
      this.genotypeFilterParams = [...this.genotypeFilterParams, genotypeFilter];
      console.log(this.genotypeFilterParams);
      this.addNewFilterItem();
    } else {
      console.error("Invalid submission: ", this.genotypeFilterForm.value);
    }
  }

  onDeleteFilter($event: Filter) {
    const targetGenotypeFilter: GenotypeFilterParams = this.generateTargetFilter($event);
    this.genotypeFilterParams = this.getFiltersWithoutTarget(targetGenotypeFilter);
  }

  private generateSampleSelectOptions() {
    const individuals = this.globalConstants.getIndividuals();
    const sampleGroups = individuals
      .map((individual: Individual) => individual.code.toUpperCase().split("_")[0])
      .filter((group: string, index: number, array: Array<string>) => array.indexOf(group) === index);
    this.allSamples = sampleGroups.map((group: string): SampleSelectGroup => {
      return {
        name: group,
        value: individuals.filter((individual: Individual) => individual.code.toUpperCase().includes(group))
      };
    });
  }

  private generateResponsiveNumberField() {
    this.selectorCtrlEvent = this.selectorCtrl.valueChanges
      .subscribe(selector => {
        if (selector == "ANY") {
          this.genotypeFiltersCtrl.addControl(
            "number",
            new FormControl(1,
              [Validators.required, Validators.min(1)])
          );
        } else {
          this.genotypeFiltersCtrl.removeControl("number");
        }
        this.genotypeFiltersCtrl.updateValueAndValidity();
      });
  }

  private getLayout(value: string): string {
    if (Object.keys(this.deviceBreakpointToggle).includes(value)) {
      return this.deviceBreakpointToggle[value];
    } else {
      return this.deviceBreakpointToggle.default;
    }
  }

  private addNewFilterItem() {
    const genotypeFilters: GenotypeFilterParams = this.genotypeFilterForm.value.genotypeFilters;
    this.filter = {
      name: "selector,number,individual,genotypeType",
      value: `${genotypeFilters.selector} ${genotypeFilters.number} [${genotypeFilters.individual}] [${genotypeFilters.genotypeType}]`,
      filterString: "",
      attributes: []
    };

    this.addFilterAttribute(genotypeFilters.selector, "chip");

    if (genotypeFilters.number) {
      this.addFilterAttribute(genotypeFilters.number, "chip");
    }

    this.addFilterAttribute("of", "text");
    const individualNames = this.getSampleNames(genotypeFilters.individual);
    this.addFilterAttribute(`[${individualNames}]`, "chip");

    this.addFilterAttribute("is", "text");
    const genotypeNames = this.getGenotypeNames(genotypeFilters.genotypeType);
    this.addFilterAttribute(`[${genotypeNames}]`, "chip");

    console.log(this.filter);
  }

  private getSampleNames(sampleIds: Array<number>) {
    return sampleIds.map((sampleId: number) => {
      const sample: Individual = this.globalConstants.getIndividuals()
        .find((sample: Individual) => sample.id === sampleId);
      return sample.code;
    });
  }

  private getGenotypeNames(genotypeIds: Array<number>) {
    return genotypeIds.map((genotypeId: number) => {
      const genotype: GenotypeType = this.allGenotypes
        .find((genotype: GenotypeType) => genotype.id === genotypeId);
      return genotype.name;
    });
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

  private generateTargetFilter(filter: Filter): GenotypeFilterParams {
    const params = filter.value.split(" ");
    const targetGenotypeFilter: GenotypeFilterParams = {
      selector: params[0],
      number: Number.parseInt(params[1]),
      individual: JSON.parse(params[2]),
      genotypeType: JSON.parse(params[3])
    };
    return targetGenotypeFilter;
  }

  private getFiltersWithoutTarget(target: GenotypeFilterParams): Array<GenotypeFilterParams> {
    const filtersWithNoTarget: Array<GenotypeFilterParams> = this.genotypeFilterParams
      .filter((value: GenotypeFilterParams) => {
        const isTargetNumberPresent = value.number != null;
        const matchSelector = value.selector === target.selector;
        const matchNumber = isTargetNumberPresent ? value.number === target.number : true;
        const matchIndividuals = this.cardinalSimilarity(target.individual, value.individual);
        const matchGenotype = this.cardinalSimilarity(target.genotypeType, value.genotypeType);

        return !matchSelector || !matchNumber || !matchIndividuals || !matchGenotype;
      });
    return filtersWithNoTarget;
  }

  private cardinalSimilarity(a: Array<any>, b: Array<any>) {
    const cardinalA = a.length;
    const cardinalB = b.length;
    const cardinalIntersect = b.filter(id => a.includes(id)).length;
    return cardinalIntersect === cardinalA && cardinalA === cardinalB;
  }
}
