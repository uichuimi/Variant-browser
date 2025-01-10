import {Sample} from "./Sample";
import {GenotypeType} from "./GenotypeType";

export interface Genotype {
  sample: Sample;
  altCount: number;
  genotypeType: GenotypeType;
  refCount: number;
}
