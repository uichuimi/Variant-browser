import { Gene } from "../../../api/varcan-service/models/response/Gene";
import { VariantLine } from "../../models/variant-line";
import { ConsequenceLine } from "../../models/consequence-line";

export class GeneLineDataSource {
  private readonly name: string;
  private readonly ensg: string;
  private readonly hgnc: string;
  private readonly ncbi: string;
  private readonly symbol: string;

  constructor(gene: Gene) {
    this.name = gene.name || "-";
    this.ensg = gene.ensg || "-";
    this.hgnc = gene.hgnc || "-";
    this.ncbi = gene.ncbi || "-";
    this.symbol = gene.symbol || "-";
  }

  get line(): ConsequenceLine {
    return {
      geneName: this.name,
      ensg: this.ensg,
      hgnc: this.hgnc,
      ncbi: this.ncbi,
      symbol: this.symbol
    }
  }

}
