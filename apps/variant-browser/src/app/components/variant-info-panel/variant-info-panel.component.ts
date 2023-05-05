import { Component, Input, OnInit } from "@angular/core";
import { VariantLine } from "../../services/data-source/models/variant-line";
import { faGear, faGauge, faPercentage, faDna } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-variant-info-panel',
  templateUrl: './variant-info-panel.component.html',
  styleUrls: ['./variant-info-panel.component.css'],
})
export class VariantInfoPanelComponent {
  @Input()
  variant: VariantLine;

  propertyColumns: any[] = [
    {name: 'name', label: 'Property name'},
    {name: 'value', label: 'Property value'}
  ];

  isVariantPresent() {
    return this.variant != null;
  }



  protected readonly Object = Object;
  protected readonly faGear = faGear;
  protected readonly faGauge = faGauge;
  protected readonly faPercentage = faPercentage;
  protected readonly faDna = faDna;
}
