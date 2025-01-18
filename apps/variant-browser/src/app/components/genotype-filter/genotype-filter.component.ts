import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { GenotypeFilterParams } from "../../services/api/varcan-service/models/request/genotype-filter-params";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { GlobalConstants } from "../../services/common/global-constants";
import { Sample } from "../../services/api/varcan-service/models/response/Sample";
import { GenotypeType } from "../../services/api/varcan-service/models/response/GenotypeType";
import { ScreenBreakpointAttributeValue } from "../../directives/device-width-breakpoint.directive";
import {faDna, faHashtag, faLayerGroup, faPlus, faProjectDiagram, faVial} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Filter } from "../../models/event-object/filter";
import { VariantLineDatasourceService } from "../../services/data-source/variant-line/variant-line-datasource.service";
import {MessageService} from "primeng/api";

interface Arity {
  selector: string;
  label: string;
}

interface SampleSelectGroup {
  disabled?: boolean;
  name: string;
  value: Array<Sample>;
}

@Component({
  selector: "app-genotype-filter",
  templateUrl: "./genotype-filter.component.html",
  styleUrls: ["./genotype-filter.component.css"],
  providers: [MessageService]
})
export class GenotypeFilterComponent implements OnInit, OnDestroy {
  number: number;
  protected faLayerGroup: IconDefinition = faLayerGroup;
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

  protected allProjects = [
    { name: "HCF", label: "HCF" },
    { name: "Project2", label: "Project 2" },
    { name: "Project3", label: "Project 3" },
    { name: "Project4", label: "Project 4" }
  ];

  protected selectedProject: string | null = null;

  protected selectedSetOperators: Arity;
  protected allSamples: Array<object>;
  protected selectedSamples: Array<number> = [];
  protected allGenotypeTypes: Array<GenotypeType>;
  protected selectedGenotypes: Array<number> = [];
  protected filter: Filter;
  private selectorCtrlEvent: Subscription;
  private samples: Sample[];

  constructor(private fb: FormBuilder, protected globalConstants: GlobalConstants,
              private dataSource: VariantLineDatasourceService, private messageService: MessageService) {
    this.genotypeFilterForm = fb.group({
      genotypeFilters: fb.group({
        sample: fb.control([], [Validators.required]),
        genotypeType: fb.control([], [Validators.required]),
        selector: fb.control("", [Validators.required]),
        project: fb.control("", [Validators.required])
      })
    });
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

  get sampleCtrl(): FormControl {
    return this.genotypeFilterForm.get("genotypeFilters.sample") as FormControl;
  }

  get numberCtrl(): FormControl {
    return this.genotypeFilterForm.get("genotypeFilters.number") as FormControl;
  }

  get projectCtrl(): FormControl {
    return this.genotypeFilterForm.get("genotypeFilters.project") as FormControl;
  }

  ngOnInit(): void {
    this.generateResponsiveNumberField();
    this.appDeviceWidthBreakpointEvent.subscribe((value) => {
      this.layout = this.getLayout(value);
    });

    this.globalConstants.genotypeTypes$.subscribe((genotypeTypes) => {
      if (!genotypeTypes) return;
      this.allGenotypeTypes = genotypeTypes;
    });

    this.globalConstants.samples$.subscribe((samples) => {
      if (!samples) return;
      this.samples = samples;
      this.generateSampleSelectOptions(samples);
    })
  }

  ngOnDestroy(): void {
    this.appDeviceWidthBreakpointEvent.unsubscribe();
    this.selectorCtrlEvent.unsubscribe();
  }

  protected async onSubmit() {
    if (this.genotypeFilterForm.valid) {
      const genotypeFilters = this.genotypeFilterForm.value.genotypeFilters;

      const project = this.selectedProject
      const selector = this.selectorCtrl.value;
      const number = this.genotypeFiltersCtrl.get("number")?.value;

      const transformedPayload = {
        filters: genotypeFilters.sample.flatMap((sample: number) =>
          genotypeFilters.genotypeType.map((genotypeType: number) => ({
            project: project,
            sample: this.getSampleNameById(sample),
            genotypeType: genotypeType.toString(),
          }))
        ),
        selector: selector,
        number: number,
      };

      this.dataSource.addGenotypeFilter({ filters: transformedPayload.filters });
      await this.dataSource.updateVariantLine();

      this.filter = {
        name: "Genotype Filter",
        value: {
          project: project,
          selector: selector,
          number: number,
          sample: genotypeFilters.sample.map((sampleId: number) => this.getSampleNameById(sampleId)),
          genotypeType: genotypeFilters.genotypeType.map((id: number) => this.getGenotypeNameById(id)),
        },
        filterString: `${genotypeFilters.sample.join(",")}|${genotypeFilters.genotypeType.join(",")}|${selector}|${number}`,
        attributes: [
          { filter: genotypeFilters.sample, type: "sample" },
          { filter: genotypeFilters.genotypeType, type: "genotypeType" },
          { filter: selector, type: "text" },
          { filter: number, type: "text" },
          { filter: project, type: "text" },
        ],
      };

      console.log("Generated Filter: ", this.filter);
      this.messageService.add({
        key: 'bc',
        severity: 'success',
        summary: 'Filter added',
        detail: 'A genotype filter has been added',
      });
    } else {
      this.messageService.add({
        key: 'ebc',
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong with your filter settings',
      });
      console.error("Invalid submission: ", this.genotypeFilterForm.value);
    }
  }



  private getSampleNameById(sampleId: number): string {
    const sample = this.samples.find((sample: Sample) => sample.id === sampleId);
    if (!sample) {
      console.error(`Sample ID ${sampleId} not found in samples`);
      return "Unknown";
    }
    return sample.chuimi;
  }

  private getGenotypeNameById(genotypeId: number): string {
    const genotype = this.allGenotypeTypes.find((genotype: GenotypeType) => genotype.id === genotypeId);
    if (!genotype) {
      console.error(`Genotype ID ${genotypeId} not found in allGenotypeTypes`);
      return "Unknown";
    }
    return genotype.name;
  }

  async onDeleteFilter($event: Filter) {
    const targetGenotypeFilter: GenotypeFilterParams = this.generateTargetFilter($event);
    this.dataSource.deleteGenotypeFilter(targetGenotypeFilter);
    await this.dataSource.updateVariantLine();
    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Filter removed', detail: 'A genotype filter have been added' });
  }

  private generateSampleSelectOptions(samples: Sample[]) {
    const sampleGroups = samples
      .map((sample: Sample) => sample.chuimi.toUpperCase().match(/[A-Z]+/)[0])
      .filter((group: string, index: number, array: Array<string>) => array.indexOf(group) === index);
    this.allSamples = sampleGroups.map((group: string): SampleSelectGroup => {
      return {
        name: group,
        value: samples.filter((sample: Sample) => sample.chuimi.toUpperCase().search(`^${group}[_0-9]*`) !== -1)
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
      name: "selector,number,sample,genotypeType",
      value: `${genotypeFilters.selector} ${genotypeFilters.number} [${genotypeFilters.sample}] [${genotypeFilters.genotypeType}]`,
      filterString: "",
      attributes: []
    };

    this.addFilterAttribute(genotypeFilters.selector, "chip");

    if (genotypeFilters.number) {
      this.addFilterAttribute(genotypeFilters.number, "chip");
    }

    this.addFilterAttribute("of", "text");
    const sampleNames = this.getSampleNames(genotypeFilters.sample);
    this.addFilterAttribute(`[${sampleNames}]`, "chip");

    this.addFilterAttribute("is", "text");
    const genotypeNames = this.getGenotypeNames(genotypeFilters.genotypeType);
    this.addFilterAttribute(`[${genotypeNames}]`, "chip");
  }

  private getSampleNames(sampleIds: Array<number>) {
    return sampleIds.map((sampleId: number) => {
      const sample: Sample = this.samples
        .find((sample: Sample) => sample.id === sampleId);
      return sample.chuimi;
    });
  }

  private getGenotypeNames(genotypeIds: Array<number>) {
    return genotypeIds.map((genotypeId: number) => {
      const genotype: GenotypeType = this.allGenotypeTypes
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
    return {
      selector: params[0],
      number: Number.parseInt(params[1]),
      sample: JSON.parse(params[2]),
      genotypeType: JSON.parse(params[3])
    };
  }

  protected readonly faProjectDiagram = faProjectDiagram; // Imagen del projecto, el icono.
}
