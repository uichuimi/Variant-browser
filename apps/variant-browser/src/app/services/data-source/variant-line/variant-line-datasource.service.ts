import { Injectable } from "@angular/core";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { VariantLine } from "../models/variant-line";
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
import { VarcanAPIEntities } from "../../api/varcan-service/misc/varcan-api-entities";
import { GenotypeFilterParams } from "../../api/varcan-service/models/request/GenotypeFilterParams";
import { ConsequenceLine } from "./consequence-line/consequence-line";
import { Biotype } from "../../api/varcan-service/models/response/Biotype";

const DECIMAL_CIPHER_APROXIMATION = 5;

@Injectable({
  providedIn: "root"
})
export class VariantLineDatasourceService extends DataSource<VariantLine> {
  totalFilteredVariants: number = 0;
  totalVariants: number = 0;
  loading$: Observable<boolean>;
  noResult$: Observable<boolean>;
  private dataStream: BehaviorSubject<Array<VariantLine>>;
  private variantParams: VariantParams;
  private loadingSubject: BehaviorSubject<boolean>;
  private noResultSubject: BehaviorSubject<boolean>;
  private cachedVariantLines: Array<VariantLine>;

  constructor(private readonly service: VarcanService,
              private readonly globalConstants: GlobalConstants) {
    super();
    this.variantParams = {genotypeFilters: new Array<GenotypeFilterParams>()};
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

  updateVariantLine() {
    this.loadingSubject.next(true);
    this.service.getVariants(this.variantParams).then(async response => {
      const page: Page<Variant> = await response.data;
      this.totalFilteredVariants = page.totalElements;
      if (this.totalVariants === 0) {
        this.totalVariants = page.totalElements;
      }
      return page.content;
    }).then(async (variants: Array<Variant>) => {
      const biotypeCache: Array<Biotype> = this.globalConstants.getBiotypes();
      const impactCache: Array<Impact> = this.globalConstants.getImpacts();
      const effectCache: Array<Effect> = this.globalConstants.getEffects();
      const geneCache: Array<Gene> = await this.getGeneCache(variants);
      this.cachedVariantLines = variants.map((variant: Variant) => {
        return this.generateVariantLine(variant, geneCache, biotypeCache,
          impactCache, effectCache);
      });
      this.dataStream.next(this.cachedVariantLines);
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

  private async getGeneCache(variants: Array<Variant>): Promise<Array<Gene>> {
    const geneIds = this.getGeneIdsFromVariant(variants);
    let geneCache: Array<Gene>;
    await this.service.getBatchGenes({ ids: geneIds })
      .then(response => geneCache = response.data);
    return geneCache;
  }

  private getGeneIdsFromVariant(variants: Array<Variant>) {
    const geneIds: Array<Array<number>> = variants.map((variant: Variant) => {
      return variant.consequence.map((consequence: Consequence) => {
        return consequence.gene;
      })
    });

    const flattenGeneIds = [].concat.apply([], geneIds);
    return flattenGeneIds
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private getChromosomeNameFromId(chromosomeId: number, nameType: string = "ucsc"): string {
    const chromosomeList: Array<Chromosome> = this.globalConstants.getChromosomes();
    if (chromosomeList != null) {
      const targetChromosome: Chromosome = chromosomeList.find((chromosome: Chromosome) => chromosome.id === chromosomeId);
      return targetChromosome[nameType] || "-";
    } else {
      return "-";
    }
  }

  private getPopulationIdFromCode(populationCode: string): number {
    const populationList: Array<Population> = this.globalConstants.getPopulation();
    const targetPopulation: Population = populationList.find((population: Population) => population.code === populationCode);
    return targetPopulation.id;
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

  private generateVariantLine(variant: Variant, geneCache: Array<Gene>, biotypeCache: Array<Biotype>,
                              impactCache: Array<Impact>, effectCache: Array<Effect>) {
    const chromosome = this.getChromosomeNameFromId(variant.chromosome);
    const consequenceLine: VariantLine = this.getConsequenceLineWithHigherImpact(variant, geneCache,
      biotypeCache, impactCache, effectCache);
    const frequency: string = this.getFrequencyByPopulationCode(variant.frequencies, "gca");
    const dp: string = this.getTotalDepth(variant.genotypes);
    const gmaf: string = this.getFrequencyByPopulationCode(variant.frequencies, "all");
    return {
      id: variant.id,
      snpId: variant.identifier || "-",
      region: `${chromosome}:${variant.position}`,
      allele: `${variant.reference} / ${variant.alternative}`,
      ...consequenceLine,
      frequency: frequency,
      dp: dp,
      gmaf: gmaf
    };
  }

  private cardinalSimilarity(a: Array<any>, b: Array<any>) {
    const cardinalA = a.length;
    const cardinalB = b.length;
    const cardinalIntersect = b.filter(id => a.includes(id)).length;
    return cardinalIntersect === cardinalA && cardinalA === cardinalB;
  }

  addPropertyFilter(propertyKey: string, value: any) {
    this.variantParams = {...this.variantParams, [propertyKey]: value};
  }

  deletePropertyFilter(propertyKey: string, value: any){
    switch (propertyKey) {
      case VarcanAPIEntities.START.name || VarcanAPIEntities.END.name:
        delete this.variantParams[propertyKey];
        break;
      default:
        const allEntities = this.variantParams[propertyKey];
        if (allEntities !== undefined) {
          this.variantParams[propertyKey] = this.variantParams[propertyKey]
            .filter((id: number) => !value.includes(id));
        } else {
          delete this.variantParams[propertyKey];
        }
        break;
    }
  }

  addGenotypeFilter(genotype: GenotypeFilterParams) {
    const genotypeFilters = [...this.variantParams.genotypeFilters, genotype];
    this.variantParams = { ...this.variantParams, genotypeFilters: genotypeFilters };
  }

  deleteGenotypeFilter(target: GenotypeFilterParams){
    this.variantParams.genotypeFilters = this.variantParams.genotypeFilters
      .filter((value: GenotypeFilterParams) => {
        const isTargetNumberPresent = value.number != null;
        const matchSelector = value.selector === target.selector;
        const matchNumber = isTargetNumberPresent ? value.number === target.number : true;
        const matchIndividuals = this.cardinalSimilarity(target.individual, value.individual);
        const matchGenotype = this.cardinalSimilarity(target.genotypeType, value.genotypeType);

        return !matchSelector || !matchNumber || !matchIndividuals || !matchGenotype;
      });
  }

  getVariantParams(): VariantParams {
    return this.variantParams;
  }

  private getConsequenceLineWithHigherImpact(variant: Variant, geneCache: Array<Gene>, biotypeCache: Array<Biotype>,
                                             impactCache: Array<Impact>, effectCache: Array<Effect>): VariantLine {
    const consequenceLines: Array<ConsequenceLine> = variant.consequence
      .sort((a, b) => b.impact - a.impact)
      .map((consequence: Consequence) => {
        return new ConsequenceLine(consequence, geneCache, biotypeCache, impactCache, effectCache);
      });
    return consequenceLines[0].line;
  }
}
