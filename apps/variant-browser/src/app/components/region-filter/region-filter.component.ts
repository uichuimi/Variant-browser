import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalConstants} from "../../services/common/global-constants";
import {VarcanService} from "../../services/api/varcan-service/varcan.service";
import {VariantLineDatasourceService} from "../../services/data-source/variant-line/variant-line-datasource.service";
import {VarcanAPIEntities} from "../../services/api/varcan-service/misc/varcan-api-entities";
import {DropListOption} from "../../models/droplist-option";
import {Chromosome} from "../../services/api/varcan-service/models/response/Chromosome";
import {ScreenBreakpointAttributeValue} from "../../directives/device-width-breakpoint.directive";
import {faHashtag, faPlus, faTag} from "@fortawesome/free-solid-svg-icons";
import {Filter} from "../../models/event-object/filter";
import {RegionFilterParams} from "../../services/api/varcan-service/models/request/region-filter-params";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-region-filter',
  templateUrl: './region-filter.component.html',
  styleUrls: ['./region-filter.component.css'],
  providers: [MessageService]
})
export class RegionFilterComponent implements OnInit {
  protected readonly faTag = faTag;
  protected readonly faPlus = faPlus;
  protected readonly faHashtag = faHashtag;

  filter: Filter;
  protected layout: string;
  protected allProperties: Array<DropListOption>;
  protected allChromosomes: Array<object>;
  protected selectedChromosomes: Array<number>;
  protected appDeviceWidthBreakpointEvent: EventEmitter<string> = new EventEmitter<string>();
  protected deviceBreakpointToggle: ScreenBreakpointAttributeValue = {
    lg: "horizontal",
    xl: "horizontal",
    default: "vertical"
  };
  protected regionFilterForm: FormGroup;
  protected isChecked: boolean = false;
  protected start: number;
  protected end: number;

  constructor(private fb: FormBuilder,
              private globalConstants: GlobalConstants,
              private service: VarcanService,
              private dataSource: VariantLineDatasourceService,
              private messageService: MessageService) {
    this.allProperties = [
      VarcanAPIEntities.CHROMOSOMES,
      VarcanAPIEntities.START,
      VarcanAPIEntities.END
    ];
    this.regionFilterForm = fb.group({
      regionFilters: fb.group({
        exclude: fb.control(false, [Validators.required]),
        chromosome: fb.control(null),
        start: fb.control(null, [Validators.min(0)]),
        end: fb.control(null, [Validators.min(0)])
      })
    });
    this.allChromosomes = this.getAllChromosomes();
    this.layout = this.deviceBreakpointToggle.default;
  }

  ngOnInit(): void {
    this.onDeviceDeviceWidthBreakPointEvent();
  }

  get excludeCtrl(): FormControl {
    return this.regionFilterForm.get("regionFilters.exclude") as FormControl;
  }

  get chromosomeCtrl(): FormControl {
    return this.regionFilterForm.get("regionFilters.chromosome") as FormControl;
  }

  get startCtrl(): FormControl {
    return this.regionFilterForm.get("regionFilters.start") as FormControl;
  }

  get endCtrl(): FormControl {
    return this.regionFilterForm.get("regionFilters.end") as FormControl;
  }

  private onDeviceDeviceWidthBreakPointEvent() {
    this.appDeviceWidthBreakpointEvent.subscribe((value) => {
      this.layout = this.getLayout(value);
    });
  }

  private getLayout(value: string): string {
    if (Object.keys(this.deviceBreakpointToggle).includes(value)) {
      return this.deviceBreakpointToggle[value];
    } else {
      return this.deviceBreakpointToggle.default;
    }
  }

  private getAllChromosomes() {
    return this.globalConstants.getChromosomes().map((chromosome: Chromosome) => {
      return {
        label: `${chromosome.ucsc} / ${chromosome.genebank} / ${chromosome.refseq}`,
        value: chromosome.ncbi
      }
    });
  }

  protected async onSubmit() {
    if (this.regionFilterForm.valid) {
      const regionFilter: RegionFilterParams = this.regionFilterForm.value.regionFilters;
      this.dataSource.addRegionFilter([regionFilter]);
      this.addFilterItem(regionFilter);
      await this.dataSource.updateVariantLine();
      await this.messageService.add({ key: 'bc', severity: 'success', summary: 'Filter added', detail: 'A property filter have been added' });
    } else {
      this.messageService.add({ key: 'ebc', severity: 'error', summary: 'Error', detail: 'Something went wrong with you filter settings' });
      console.error("Invalid submission: ", this.regionFilterForm);
    }
  }

  protected async onDeleteFilter($event: Filter) {
    const targetRegionFilter: RegionFilterParams = this.generateTargetFilter($event);
    console.log(targetRegionFilter);
    this.dataSource.deleteRegionFilter([targetRegionFilter]);
    await this.dataSource.updateVariantLine();
    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Filter removed', detail: 'A region filter have been added' });
  }

  private addFilterItem(regionFilter: RegionFilterParams) {
    this.filter = {
      name: "chromosome,start,end,exclude",
      value: `${regionFilter.chromosome} ${regionFilter.start} ${regionFilter.end} ${regionFilter.exclude}`,
      filterString: "",
      attributes: []
    };

    const excludeText: string = regionFilter.exclude ? "Not in" : "In"

    this.addFilterAttribute(excludeText, "chip");

    let regionStr: string;
    console.log(regionFilter.chromosome);
    if (regionFilter.chromosome) {
      regionStr = this.globalConstants.getChromosomes()
        .find((chromosome: Chromosome) => chromosome.ncbi === regionFilter.chromosome).ucsc;
    } else {
      regionStr = "*";
    }

    regionStr = regionStr + ":";

    if (regionFilter.start) {
      regionStr = regionStr + `${regionFilter.start}`;
    } else {
      regionStr = regionStr + "*";
    }

    regionStr = regionStr + "-";

    if (regionFilter.end) {
      regionStr = regionStr + `${regionFilter.end}`;
    } else {
      regionStr = regionStr + "*";
    }

    this.addFilterAttribute(regionStr, "chip");
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

  private generateTargetFilter(filter: Filter) {
    const params = filter.value.split(" ");
    return {
      chromosome: params[0],
      start: Number.parseInt(params[1]),
      end: Number.parseInt(params[2]),
      exclude: params[3] == "true"
    };
  }
}
