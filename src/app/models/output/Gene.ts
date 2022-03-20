import { Biotype } from "./Biotype";

export interface Gene {
    id: number,
    ensg: string,
    hgnc: string,
    name?: string,
    ncbi: string,
    symbol?: string,
    biotype?: Biotype,
    transcripts?: Array<number>
}