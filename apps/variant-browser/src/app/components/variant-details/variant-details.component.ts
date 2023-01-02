import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Variant } from "../../services/api/varcan-service/models/response/Variant";

@Component({
  selector: "app-variant-line-details",
  templateUrl: "./variant-details.component.html",
  styleUrls: ["./variant-details.component.css"]
})
export class VariantDetailsComponent implements OnChanges {

  @Input() variant: Variant;

  data = [
    {
      id: 1,
      value: "hola"
    }
  ];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("HOLA VARIANTE", this.variant, changes);
  }

}
