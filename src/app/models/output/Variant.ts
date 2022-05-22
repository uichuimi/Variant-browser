export interface Variant {
    id: number;
    chromosome_id: number;
    position: number;
    reference: string;
    alternative: string;
    identifier: string;
    consequence: number;
    frequencies: Array<number>;
    genotypes: Array<number>; 
}