import {Gene} from "./Gene";

export interface Transcript {
  id: number;
  enst?: string;
  gene: Gene;
  dna_ncbi?: string;
  rna_ncbi?: string;
  start?: string;
  end?: string;
}
