import { Sample } from "../../../api/varcan-service/models/response/Sample";
import { GenotypeType } from "../../../api/varcan-service/models/response/GenotypeType";
import { Genotype } from "../../../api/varcan-service/models/response/Genotype";
import { VariantLine } from "../../models/variant-line";
import { GenotypeLine } from "../../models/genotype-line";

export class GenotypeLineDataSource {
  private reference: string;
  private alternative: string;
  private chuimi: string;
  private cnag: string;
  private genotypeType: string;
  private referenceCount: number;
  private alternativeCount: number;

  constructor(reference: string, alternative: string, genotype: Genotype, sampleCache: Array<Sample>,
              genotypeTypeCache: Array<GenotypeType>) {
    this.reference = reference;
    this.alternative = alternative;
    this.chuimi = this.getSampleName(genotype.sample.id, sampleCache, 'chuimi');
    this.cnag = this.getSampleName(genotype.sample.id, sampleCache, 'cnag');
    this.genotypeType = this.getGenotypeTypeName(genotype.genotypeType.id, genotypeTypeCache);
    this.referenceCount = genotype.refCount;
    this.alternativeCount = genotype.altCount;
  }

  private getSampleName(SampleId: number, sampleCache: Array<Sample>, fieldName: string): string {
    const sample: Sample = sampleCache
      .find((sample: Sample) => sample.id === SampleId);
    return `${sample[fieldName]}`;
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
      [this.chuimi]: genotype,
      [`DP (${this.chuimi})`]: `${this.referenceCount + this.alternativeCount}`,
      chuimi: this.chuimi,
      cnag: this.cnag,
      genotype: this.genotypeType,
      refCount: this.referenceCount,
      altCount: this.alternativeCount
    }
  }
}
