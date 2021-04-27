export interface Gene {​​​​
    ensg:   string;
    hgnc:   string;
    name:   string;
    ncbi:   string;
    symbol: string;
    type:   string;
    drugs: GeneDrug[];
    diseases: GeneDisease[]
}​​​​

export interface GeneDisease{
    disease: Disease;
    evidence: string;
}

export interface GeneDrug{
    association: string;
    pharmacodynamic: boolean;
    pharmacokinetic: boolean;
    drug: Drug;
}

export interface Drug{
    identifier: string;
    name: string;
}

export interface Effect {​​​​
    term: string;
    description: string;
    accession: string;
    displayName: string;
    impact: string;
}​​​​

export interface Frequency {​​​​
    ac: number;
    af: number;
    an: number;
    population: Population;
}​​​​

export interface Population{
    identifier: string;
    description: string;
}

export interface Disease{
    identifier: string;
    name:   string;
    xrefs:  string;
}

export interface Variant {
    gene : Gene;
    effect: Effect[];
    frequencies: Frequency[];

    alt: string;
    ref: string;
    identifier: string;
    pos: number;
    chrom: string;
    sift: number | null;
    polyphen: number | null;

    homozygous: Genotype[];
    wildtype: Genotype[];
    heterozygoes: Genotype[];

    ac: number;
    af: number;
    an: number;
    vid: number;
    hgvsp: string; //CHANGE -> AMINO

    diseases: VariantDisease[];
}

export interface VariantDisease{
    significance: string;
    status: string;
    conflicts:  string;
    disease: Disease;
}

export interface Sample{
    identifier: string;
}

export interface Genotype{
    alternateCount: number;
    gt: string;
    referenceCount: number;
    sample: Sample;
}