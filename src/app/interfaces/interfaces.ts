//Interfaces for the JSON response given by the VariantController in the API

export class Biotype{
    description: string;
    identifier: string;
    name: string;
}

export class Gene {
    biotype: Biotype;
    ensg: string;
    hgnc: string;
    name: string;
    ncbi: string;
    symbol: string;
}

export class Effect {
  description: string;
  identifier: string;
  impact: string;
  name: string;
}

export class Consequence{
    effect: Effect;
    gene: Gene;
    hgvsc: string;
    hgvsp: string;
    polyphe: number;
    sift: number;
    transcript: string;
}

export class Disease{
    identifier: string;
    name: string;
    xref: string[];
}

export class Frequency{
    ac: number;
    af: number;
    an: number;
    population: Population;
}

export class Population{
    description: string;
    identifier: string;
}

export class Genotype{
    altCount: number;
    gt: number;
    refCount: number;
    sample: Sample;
    type: string;
}

export class Sample{
    identifier: string;
}

export class Variant{
    identifier: string;
    pos: number;
    ref: string;
    vid: number;
    alt: string;
    chrom: string;
    
    consequence: Consequence;
    disease: VariantDisease[];
    frequencies: Frequency[];
    heterozygous: Genotype[];
    homozygous: Genotype[];
    wildtype: Genotype[];
}

export class VariantDisease{
    conflict: string;
    disease: Disease;
    significance: string;
    status: string;
}