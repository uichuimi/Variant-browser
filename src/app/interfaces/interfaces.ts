export interface Gene {​​​​
  description: string;
  name: string;
  identifier: string;
  biotype: string;
}​​​​
 
 export interface Effect {​​​​
  term: string;
  description: string;
  accession: string;
  displayName: string;
  impact: string;
}​​​​
 
export interface Frequency {​​​​
  population: string;
  source: string;
  value: number;
}​​​​

export interface Disease{
	name: string;
	identifier: string;
}

export interface Variant {
	gene : Gene;
	effect: Effect;
	gmaf: number;
	frequencies: Frequency[];

	alt: string;
	ref: string;
	identifier: string;
	pos: any;
	chrom: number;
	sift: string | null;
	polyphen: string | null;
	amino: string | null;

	chromosome: Chromosome;

	homozygous: Sample[];
	wildtype: Sample[];
	heterozygoes: Sample[];
}

export interface Chromosome{
	name: string;
	index: number;
}

export interface Sample{
	id: number;
	identifier: string;
}