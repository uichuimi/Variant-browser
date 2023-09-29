import { Component } from '@angular/core';
import {faDna, faScrewdriverWrench, faPercentage, faMapLocationDot, faGear} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-variant-filter-panel',
  templateUrl: './variant-filter-panel.component.html',
  styleUrls: ['./variant-filter-panel.component.css'],
})
export class VariantFilterPanelComponent {
  protected readonly faDna: IconDefinition = faDna;
  protected readonly faScrewdriverWrench: IconDefinition = faScrewdriverWrench;
  protected readonly faPercentage: IconDefinition = faPercentage;
  protected readonly faMapLocationDot = faMapLocationDot;
  protected readonly faGear = faGear;
}
