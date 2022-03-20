export interface Gene {
    id: number,
    ensg: string,
    hgnc: string,
    name?: string,
    ncbi: string,
    symbol?: string,
    biotype?: number,
    transcripts?: Array<number>
}