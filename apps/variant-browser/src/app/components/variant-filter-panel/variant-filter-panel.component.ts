import { Component } from '@angular/core';
import {faDna, faScrewdriverWrench, faPercentage, faMapLocationDot} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-variant-filter-panel',
  templateUrl: './variant-filter-panel.component.html',
  styleUrls: ['./variant-filter-panel.component.css'],
})
export class VariantFilterPanelComponent {
  protected faDna: IconDefinition = faDna;
  protected faScrewdriverWrench: IconDefinition = faScrewdriverWrench;
  protected faPercentage: IconDefinition = faPercentage;
  protected readonly faMapLocationDot = faMapLocationDot;
}
