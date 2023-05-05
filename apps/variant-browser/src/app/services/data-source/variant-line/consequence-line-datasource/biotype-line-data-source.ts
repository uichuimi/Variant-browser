import { Biotype } from "../../../api/varcan-service/models/response/Biotype";
import { ConsequenceLine } from "../../models/consequence-line";

export class BiotypeLineDataSource {
  private readonly name: string;
  private readonly accession: string;
  private readonly description: string;

  constructor(biotype: Biotype) {
    if (biotype) {
      this.name = biotype.name;
      this.accession = biotype.accession;
      this.description = biotype.description;
    }
  }

  get line(): ConsequenceLine {
    return {
      biotypeName: this.name || "-",
      biotypeAccession: this.accession || "-",
      biotypeDescription: this.description || "-"
    }
  }
}
