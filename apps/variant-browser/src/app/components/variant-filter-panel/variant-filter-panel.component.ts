import { Component } from '@angular/core';
import { faDna, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-variant-filter-panel',
  templateUrl: './variant-filter-panel.component.html',
  styleUrls: ['./variant-filter-panel.component.css'],
})
export class VariantFilterPanelComponent {
  protected faDna: IconDefinition = faDna;
  protected faScrewdriverWrench: IconDefinition = faScrewdriverWrench;
}
