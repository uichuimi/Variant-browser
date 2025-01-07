import { Consequence } from "./Consequence";
import { Frequency } from "./Frequency";
import { Genotype } from "./Genotype";
import {Chromosome} from "./Chromosome";

export interface Variant {
    id: number;
    chromosome: Chromosome;
    position: number;
    reference: string;
    alternative: string;
    identifier: string;
    consequence: Array<Consequence>;
    frequencies: Array<Frequency>;
    genotypes: Array<Genotype>;
}
