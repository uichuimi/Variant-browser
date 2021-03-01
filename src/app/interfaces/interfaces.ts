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

export interface Variant {
	gene : Gene;
	effect: Effect;
	gmaf: number;
	frequencies: Frequency[];

	alt: string;
	identifier: string;
	pos: number;
	chrom: number;
	sift: string | null;
	polyphen: string | null;
	amino: string | null;

	chromosome: Chromosome;

	homozygous: Person[];
	wildtype: Person[];
	heterozygoes: Person[];
}

export interface Chromosome{
	name: string;
	index: number;
}

export interface Person{
	id: number;
	identifier: string;
}