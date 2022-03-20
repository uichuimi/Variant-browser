import { Impact } from "./Impact";

export interface Effect {
    id: number;
    accession: string;
    description: string;
    name: string;
    impact: Impact;
}