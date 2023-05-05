import { Individual } from "../../../api/varcan-service/models/response/Individual";
import { GenotypeType } from "../../../api/varcan-service/models/response/GenotypeType";
import { Genotype } from "../../../api/varcan-service/models/response/Genotype";
import { VariantLine } from "../../models/variant-line";
import { GenotypeLine } from "../../models/genotype-line";

export class GenotypeLineDataSource {
  private reference: string;
  private alternative: string;
  private individual: string;
  private genotypeType: string;
  private referenceCount: number;
  private alternativeCount: number;

  constructor(reference: string, alternative: string, genotype: Genotype,individualCache: Array<Individual>,
              genotypeTypeCache: Array<GenotypeType>) {
    this.reference = reference;
    this.alternative = alternative;
    this.individual = this.getIndividualName(genotype.individual, individualCache);
    this.genotypeType = this.getGenotypeTypeName(genotype.genotypeType, genotypeTypeCache);
    this.referenceCount = genotype.refCount;
    this.alternativeCount = genotype.altCount;
  }

  private getIndividualName(individualId: number, individualCache: Array<Individual>): string {
    const individual: Individual = individualCache
      .find((individual: Individual) => individual.id === individualId);
    return individual.code;
  }

  private getGenotypeTypeName(genotypeTypeId: number, genotypeTypeCache: Array<GenotypeType>) {
    const genotypeType: GenotypeType = genotypeTypeCache
      .find((genotypeType: GenotypeType) => genotypeType.id === genotypeTypeId);
    return genotypeType.name;
  }

  get line(): GenotypeLine {
    const genotype = `${this.genotypeType} ` +
      `(${this.reference}=${this.referenceCount} | ` +
      `${this.alternative}=${this.alternativeCount})`;
    return {
      [this.individual]: genotype,
      [`DP (${this.individual})`]: `${this.referenceCount + this.alternativeCount}`,
      individual: this.individual,
      genotype: this.genotypeType,
      refCount: this.referenceCount,
      altCount: this.alternativeCount
    }
  }
}
