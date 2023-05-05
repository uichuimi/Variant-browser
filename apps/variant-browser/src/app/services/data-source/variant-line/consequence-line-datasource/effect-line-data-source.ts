import { Effect } from "../../../api/varcan-service/models/response/Effect";
import { VariantLine } from "../../models/variant-line";
import { ConsequenceLine } from "../../models/consequence-line";

export class EffectLineDataSource {
  private readonly name: string;
  private readonly accession: string;
  private readonly description: string;

  constructor(effect: Effect) {
    this.name = effect.name || "-";
    this.accession = effect.accession || "-";
    this.description = effect.description || "-";
  }

  get line(): ConsequenceLine {
    return {
      effectName: this.name,
      effectAccession: this.accession,
      effectDescription: this.description
    }
  }

}
