import { Impact } from "../../../api/varcan-service/models/response/Impact";
import { VariantLine } from "../../models/variant-line";

export class ImpactLine {
  private readonly name: string;

  constructor(impact: Impact) {
    this.name = impact.name || "-";
  }

  get line(): VariantLine {
    return {
      impact: this.name
    }
  }

}
