import { Component } from '@angular/core';
import {DropListOption} from "../../models/droplist-option";
import {CENTROMERIC_REGIONS_FILTERS} from "../../utils/globals/centromeric-regions-filters";
import {VariantLineDatasourceService} from "../../services/data-source/variant-line/variant-line-datasource.service";
import {dasherize} from "@nrwl/workspace/src/utils/strings";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-miscellaneous-filter',
  templateUrl: './miscellaneous-filter.component.html',
  styleUrls: ['./miscellaneous-filter.component.css'],
  providers: [MessageService]
})
export class MiscellaneousFilterComponent {
  protected centromereExcludeOptions: any[] = [
    { label: "Off", value: false },
    { label: "On", value: true }
  ];
  protected centromereExcludeValue: boolean = false;

  constructor(private dataSource: VariantLineDatasourceService, private messageService: MessageService) {
  }

  onCentromereExcludeEvent() {
    if (this.centromereExcludeValue) {
      this.dataSource.addRegionFilter(CENTROMERIC_REGIONS_FILTERS);
      this.messageService.add({ key: 'bc', severity: 'success', summary: 'Filter added', detail: 'Centromeric filters have been turned on' });
    } else {
      this.dataSource.deleteRegionFilter(CENTROMERIC_REGIONS_FILTERS);
      this.messageService.add({ key: 'bc', severity: 'success', summary: 'Filter added', detail: 'Centromeric filters have been turned off' });
    }

    this.dataSource.updateVariantLine();
  }
}
