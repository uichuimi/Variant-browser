import { Impact } from "../../../api/varcan-service/models/response/Impact";
import { VariantLine } from "../../models/variant-line";
import { ConsequenceLine } from "../../models/consequence-line";

export class ImpactLineDataSource {
  private readonly name: string;

  constructor(impact: Impact) {
    this.name = impact.name || "-";
  }

  get line(): ConsequenceLine {
    return {
      impact: this.name
    }
  }

}
