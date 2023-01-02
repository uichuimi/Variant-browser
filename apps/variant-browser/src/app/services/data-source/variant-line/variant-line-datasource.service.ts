import { Injectable } from "@angular/core";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { VariantLine } from "../../../models/table/VariantLine";
import { VarcanService } from "../../api/varcan-service/varcan.service";
import { GlobalConstants } from "../../common/global-constants";
import { Page } from "../../api/varcan-service/models/response/Page";
import { Variant } from "../../api/varcan-service/models/response/Variant";
import { VariantParams } from "../../api/varcan-service/models/request/VariantParams";
import { Chromosome } from "../../api/varcan-service/models/response/Chromosome";
import { Effect } from "../../api/varcan-service/models/response/Effect";
import { Gene } from "../../api/varcan-service/models/response/Gene";
import { Consequence } from "../../api/varcan-service/models/response/Consequence";
import { Impact } from "../../api/varcan-service/models/response/Impact";
import { Population } from "../../api/varcan-service/models/response/Population";
import { Frequency } from "../../api/varcan-service/models/response/Frequency";
import { Sort } from "@angular/material/sort";
import { Genotype } from "../../api/varcan-service/models/response/Genotype";

const DECIMAL_CIPHER_APROXIMATION = 5;

@Injectable({
  providedIn: "root"
})
export class VariantLineDatasourceService extends DataSource<VariantLine> {
  totalFilteredVariants: number = 0;
  totalVariants: number = -1;
  loading$: Observable<boolean>;
  noResult$: Observable<boolean>;
  private dataStream: BehaviorSubject<Array<VariantLine>>;
  private loadingSubject: BehaviorSubject<boolean>;
  private noResultSubject: BehaviorSubject<boolean>;
  private cachedVariantLines: Array<VariantLine>;

  constructor(private readonly service: VarcanService,
              private readonly globalConstants: GlobalConstants) {
    super();
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.noResultSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
    this.noResult$ = this.noResultSubject.asObservable();
    this.dataStream = new BehaviorSubject<Array<VariantLine>>([]);
  }

  connect(collectionViewer: CollectionViewer): Observable<VariantLine[]> {
    return this.dataStream.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataStream.complete();
    this.loadingSubject.complete();
  }

  filterData(value: string, pressedBackspace: boolean) {
    let variantLines: Array<VariantLine> = this.dataStream.getValue();

    if (pressedBackspace) {
      variantLines = this.cachedVariantLines;
      this.dataStream.next(this.cachedVariantLines);
    }

    const variantLineKeys = Object.keys(variantLines[0]);
    let filteredVariantLines: Array<VariantLine> = variantLines.filter((variantLine: VariantLine) => {
      return this.isMatchingFilterPattern(variantLineKeys, variantLine, value);
    });

    if (filteredVariantLines.length === 0) {
      this.noResultSubject.next(true);
    } else {
      this.noResultSubject.next(false);
    }

    this.dataStream.next(filteredVariantLines);
  }

  sortData(sort: Sort) {
    let variantLines: Array<VariantLine> = this.dataStream.getValue();
    let sortedVariantLines: Array<VariantLine>;
    sortedVariantLines = variantLines.sort((a, b) => {
      switch (sort.direction) {
        case "asc":
          return this.compareValues(a, b, sort.active) ? 1 : -1;
        case "desc":
          return this.compareValues(a, b, sort.active) ? -1 : 1;
        default:
          return 0;
      }
    });
    this.dataStream.next(sortedVariantLines);
  }

  async updateVariantLine(variantParams: VariantParams) {
    this.loadingSubject.next(true);
    this.service.getVariants(variantParams).then(response => {
      const page: Page<Variant> = response.data;
      this.totalFilteredVariants = page.totalElements;
      if (this.totalVariants < 0) {
        this.totalVariants = page.totalElements;
      }
      const variants: Array<Variant> = page.content;
      this.getGeneList(variants).then((genes: Array<Gene>) => {
        this.cachedVariantLines = variants.map((variant: Variant) => {
          return this.generateVariantLine(variant, genes);
        });
        this.dataStream.next(this.cachedVariantLines);
      });
    }).finally(() => this.loadingSubject.next(false));
  }

  private isMatchingFilterPattern(variantLineKeys: string[], variantLine: VariantLine, value: string): boolean {
    let isMatching: Array<boolean> = [];
    variantLineKeys.forEach((field: string) => {
      switch (field) {
        case "id":
          isMatching.push(variantLine.id === parseInt(value));
          break;
        default:
          isMatching.push(variantLine[field].toLowerCase().includes(value));
          break;
      }
    });
    return isMatching.some((element: boolean) => element === true);
  }

  private compareValues(a: VariantLine, b: VariantLine, field: string): boolean {
    switch (field) {
      case "frequency" || "gmaf":
        const regexFreq = /\(\d+\.*\d*%\)/g;
        const regexLastIndex = /%/g;
        let aLastIndex: number = a[field].search(regexLastIndex);
        let bLastIndex: number = b[field].search(regexLastIndex);
        let aFreq = a[field].match(regexFreq).toString().substring(1, aLastIndex);
        let bFreq = b[field].match(regexFreq).toString().substring(1, bLastIndex);
        return parseFloat(aFreq) < parseFloat(bFreq);
      case "id":
        return a[field] < b[field];
      default:
        return (a[field] as string).localeCompare((b[field] as string)) < 0;
    }
  }

  private getGeneList(variants: Array<Variant>): Promise<Array<Gene>> {
    const geneIds: Array<Array<number>> = variants.map((variant: Variant) => {
      return variant.consequence.map((consequence: Consequence) => {
        return consequence.gene;
      });
    });

    const flattenGeneIds = [].concat.apply([], geneIds);
    return this.service.getBatchGenes({ ids: flattenGeneIds })
      .then(response => response.data);
  }

  private getChromosomeNameFromId(chromosomeId: number, nameType: string = "ucsc"): string {
    const chromosomeList: Array<Chromosome> = this.globalConstants.getChromosomes();
    const targetChromosome: Chromosome = chromosomeList.find((chromosome: Chromosome) => chromosome.id === chromosomeId);
    return targetChromosome[nameType] || "-";
  }

  private getEffectNameFromId(effectId: number): string {
    const effectList: Array<Effect> = this.globalConstants.getEffects();
    const targetEffect: Effect = effectList.find((effect: Effect) => effect.id === effectId);
    return targetEffect.name || "-";
  }

  private getGeneNameFromId(geneId: number, geneList: Array<Gene>): string {
    const targetGene: Gene = geneList.find((gene: Gene) => gene.id === geneId);
    return targetGene.ensg || "-";
  }

  private getImpactIdFromName(impactName: string): number {
    const impactList: Array<Impact> = this.globalConstants.getImpacts();
    const targetImpact: Impact = impactList.find((impact: Impact) => impact.name === impactName);
    return targetImpact.id;
  }

  private getImpactNameFromId(impactId: number): string {
    const impactList: Array<Impact> = this.globalConstants.getImpacts();
    const targetImpact: Impact = impactList.find((impact: Impact) => impact.id === impactId);
    return targetImpact.name || "-";
  }

  private getPopulationIdFromCode(populationCode: string): number {
    const populationList: Array<Population> = this.globalConstants.getPopulation();
    const targetPopulation: Population = populationList.find((population: Population) => population.code === populationCode);
    return targetPopulation.id;
  }

  private getPopulationNameFromId(populationId: number): string {
    const populationList: Array<Population> = this.globalConstants.getPopulation();
    const targetPopulation: Population = populationList.find((population: Population) => population.id === populationId);
    return targetPopulation.name || "-";
  }

  private getConsequenceWithHighestImpact(consequenceList: Array<Consequence>): Consequence {
    const impactNames: Array<string> = ["HIGH", "MODERATE", "LOW", "MODIFIER"];
    const impactIds: Array<number> = impactNames.map(name => this.getImpactIdFromName(name));
    const consequences: Array<Consequence> = impactIds.map((impactId: number) => {
      return consequenceList.find((consequence: Consequence) => consequence.impact === impactId);
    });
    return consequences.find((consequence: Consequence) => consequence != null);
  }

  private getFrequencyByPopulationCode(frequencies: Array<Frequency>, populationCode: string): string {
    const populationId: number = this.getPopulationIdFromCode(populationCode);
    const targetFrequency: Frequency = frequencies.find((frequency: Frequency) => frequency.population === populationId);
    if (targetFrequency != null) {
      let relativeFrequency: number = targetFrequency.ac / targetFrequency.an * 100;
      let roundRelativeFrequency = Math.round((relativeFrequency + Number.EPSILON) * 10 ** DECIMAL_CIPHER_APROXIMATION) / 10 ** DECIMAL_CIPHER_APROXIMATION;
      return `${targetFrequency.ac} / ${targetFrequency.an} (${roundRelativeFrequency}%)`;
    }
    return "-";
  }

  private getTotalDepth(genotypes: Array<Genotype>) {
    let dp = 0;
    genotypes.forEach((genotype: Genotype) => dp += genotype.altCount + genotype.refCount);
    return `${dp}`;
  }

  private generateVariantLine(variant: Variant, genes: Array<Gene>) {
    const chromosome = this.getChromosomeNameFromId(variant.chromosome);
    const consequence: Consequence = this.getConsequenceWithHighestImpact(variant.consequence);
    const gene: string = this.getGeneNameFromId(consequence.gene, genes);
    const effect: string = this.getEffectNameFromId(consequence.effect);
    const impact: string = this.getImpactNameFromId(consequence.impact);
    const frequency: string = this.getFrequencyByPopulationCode(variant.frequencies, "gca");
    const dp: string = this.getTotalDepth(variant.genotypes);
    const gmaf: string = this.getFrequencyByPopulationCode(variant.frequencies, "all");
    return {
      id: variant.id,
      snpId: variant.identifier || "-",
      region: `${chromosome}:${variant.position}`,
      allele: `${variant.reference} / ${variant.alternative}`,
      gene: gene,
      effect: effect,
      impact: impact,
      frequency: frequency,
      dp: dp,
      gmaf: gmaf
    };
  }
}
