import {GenotypeFilterParams} from './genotype-filter-params';
import { FrequencyFilterParams } from "./frequency-filter-params";

export interface VariantParams {
    page?: number;
    size?: number;
    chromosomes?: Array<number>;
    start?: number;
    end?: number;
    genes?: Array<number>;
    biotypes?: Array<number>;
    effects?: Array<number>;
    impacts?: Array<number>;
    identifiers?: Array<number>;
    genotypeFilters?: Array<GenotypeFilterParams>;
    frequencyFilters?: Array<FrequencyFilterParams>;
}
