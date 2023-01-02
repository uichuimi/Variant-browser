import { Consequence } from "./Consequence";
import { Frequency } from "./Frequency";
import { Genotype } from "./Genotype";

export interface Variant {
    id: number;
    chromosome: number;
    position: number;
    reference: string;
    alternative: string;
    identifier: string;
    consequence: Array<Consequence>;
    frequencies: Array<Frequency>;
    genotypes: Array<Genotype>;
}
