import {GenotypeFilterParams} from './genotype-filter-params';

export interface CsvVariantReportParams {
    fields: Array<string>;
    chromosomes?: Array<number>;
    start?: number;
    end?: number;
    genes?: Array<number>;
    biotypes?: Array<number>;
    effects?: Array<number>;
    impacts?: Array<number>;
    identifiers?: Array<number>;
    genotypeFilters?: Array<GenotypeFilterParams>;
}
