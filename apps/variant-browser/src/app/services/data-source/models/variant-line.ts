import { GenotypeLine } from "./genotype-line";
import { ConsequenceLine } from "./consequence-line";
import { FrequencyLine } from "./frequency-line";

export interface VariantLine {
  id?: number;
  snpId?: string;
  region?: string;
  allele?: string;
  gmaf?: string
  dp?: string;
  genotypes?: Array<GenotypeLine>;
  consequences?: Array<ConsequenceLine>;
  frequencies?: Array<FrequencyLine>
}
