import { Injectable } from "@angular/core";
import { VariantLine } from "../models/variant-line";
import { VarcanService } from "../../api/varcan-service/varcan.service";
import { GlobalConstants } from "../../common/global-constants";
import { Page } from "../../api/varcan-service/models/response/Page";
import { Variant } from "../../api/varcan-service/models/response/Variant";
import { VariantParams } from "../../api/varcan-service/models/request/variant-params";
import { Chromosome } from "../../api/varcan-service/models/response/Chromosome";
import { Effect } from "../../api/varcan-service/models/response/Effect";
import { Gene } from "../../api/varcan-service/models/response/Gene";
import { Consequence } from "../../api/varcan-service/models/response/Consequence";
import { Impact } from "../../api/varcan-service/models/response/Impact";
import { Population } from "../../api/varcan-service/models/response/Population";
import { Frequency } from "../../api/varcan-service/models/response/Frequency";
import { Genotype } from "../../api/varcan-service/models/response/Genotype";
import { VarcanAPIEntities } from "../../api/varcan-service/misc/varcan-api-entities";
import { GenotypeFilterParams } from "../../api/varcan-service/models/request/genotype-filter-params";
import { ConsequenceLineDataSource } from "./consequence-line-datasource/consequence-line-data-source";
import { Biotype } from "../../api/varcan-service/models/response/Biotype";
import { LazyLoadEvent } from "primeng/api";
import { Observable, Subject } from "rxjs";
import { GenotypeLineDataSource } from "./genotype-line-datasource/genotype-line-data-source";
import { Individual } from "../../api/varcan-service/models/response/Individual";
import { GenotypeType } from "../../api/varcan-service/models/response/GenotypeType";
import { GenotypeLine } from "../models/genotype-line";
import { ConsequenceLine } from "../models/consequence-line";
import { FrequencyLine } from "../models/frequency-line";
import { FrequencyLineDatasource } from "./frequency-line-datasource/frequency-line-datasource";
import { CsvVariantReportParams } from "../../api/varcan-service/models/request/csv-variant-report-params";
import { FrequencyFilterParams } from "../../api/varcan-service/models/request/frequency-filter-params";

const DECIMAL_CIPHER_APROXIMATION = 5;

@Injectable({
  providedIn: "root"
})
export class VariantLineDatasourceService {
  private _loading: boolean;
  private _totalRecords: number;
  private _variantFields: Array<{name: string, label: string, show:boolean}>;
  private variants: Array<Variant>;
  private cachedVariantLines;
  private variantParams: VariantParams;
  private biotypeCache: Array<Biotype>;
  private impactCache: Array<Impact>;
  private effectCache: Array<Effect>;
  private geneCache: Array<Gene>;
  private individualCache: Array<Individual>;
  private genotypeTypeCache: Array<GenotypeType>;
  private populationCache: Array<Population>;
  private dataSubject = new Subject<any>();
  data$: Observable<any> = this.dataSubject.asObservable();

  constructor(private readonly service: VarcanService,
              private readonly globalConstants: GlobalConstants) {
    this._loading = true;
    this._totalRecords = 0;
    this._variantFields = [];
  }

  get loading() {
    return this._loading;
  }

  get totalRecords() {
    return this._totalRecords;
  }

  get variantFields() {
    return this._variantFields;
  }

  set variantFields(fields: any[]) {
    fields.forEach((value) => {
      this._variantFields = this._variantFields.map((variantField) => {
        if (variantField.name === value.name) {
          variantField.show = !value.show;
        }
        return variantField;
      });
    })
  }

  get variantLine() {
    return this.cachedVariantLines;
  }

  async updateVariantLine(variantParams?: VariantParams, event?: LazyLoadEvent) {
    if (variantParams != null) {
      this.variantParams = variantParams;
    }
    let page: Page<Variant>;
    await this.service.getVariants(this.variantParams).then(res => page = res.data)
    await this.getVariantLine(page, event);
    this._loading = false;
    this.data$ = this.cachedVariantLines;
    this.dataSubject.next(this.data$);
    return this.cachedVariantLines;
  }

  private async getVariantLine(page: Page<Variant>, event?: LazyLoadEvent) {
    this._totalRecords = page.totalElements;
    if (this.totalRecords == 0) {
      this.variants = [];
      this.cachedVariantLines = [];
      return;
    }
    this.variants = page.content.map(this.markNullValues());

    if (event != null && event.sortField != null && event.sortOrder != 0) {
      this.sortData(event, event.sortField, event.sortOrder);
    }

    this.biotypeCache = this.globalConstants.getBiotypes();
    this.impactCache = this.globalConstants.getImpacts();
    this.effectCache = this.globalConstants.getEffects();
    this.individualCache = this.globalConstants.getIndividuals();
    this.genotypeTypeCache = this.globalConstants.getGenotypeTypes();
    this.populationCache = this.globalConstants.getPopulation();
    this.geneCache = await this.getGeneCache(this.variants);

    this.cachedVariantLines = this.variants.map((variant: Variant) => {
      return this.generateVariantLine(variant);
    });

    if (this._variantFields.length == 0) {
      this.extractTableFields();
    }
  }

  private markNullValues() {
    return (variant: Variant) => {
      Object.keys(variant).forEach((field: string) => {
        if (variant[field] == null) {
          variant[field] = "-";
        }
      });
      return variant;
    };
  }

  private sortData(event: LazyLoadEvent, field: string, order: number) {
    this.variants = this.variants.sort(this.compareVariantFields(field, order));
  }

  private compareVariantFields(field: string, order: number) {
    return (a: Variant, b: Variant) => {
      if (typeof a[field] === "string" && typeof b[field] === "string") {
        return (a[field] as string).localeCompare((b[field] as string)) * order;
      } else {
        return ((a[field] as number) - (b[field] as number)) * order;
      }
    };
  }

  private extractTableFields() {
    let fieldNames: Array<string> = Object.keys(this.cachedVariantLines[0]);

    const columns = fieldNames.map((field: string) => {
      let label: string = this.labelize(field);
      if (['consequences', 'frequencies', 'genotypes'].includes(field)) {
        let innerFieldNames: Array<string>;
        if (field === 'frequencies') {
          innerFieldNames = this.populationCache
            .map(population => population.code).concat(['population']);
        } else if (field === 'genotypes') {
          innerFieldNames = this.individualCache.map(individual => individual.code);
        } else {
          innerFieldNames= Object.keys(this.cachedVariantLines[0][field][0]);
        }
        const innerColumns = innerFieldNames.map((innerField: string) => {
          let innerLabel: string = this.labelize(innerField);
          return {
            name: innerField,
            label: innerLabel,
            show: false
          };
        });
        this._variantFields = this._variantFields.concat(innerColumns);
      } else {
        return {
          name: field,
          label: label,
          show: true
        };
      }
    });
    this._variantFields = columns.concat(this._variantFields);
    this._variantFields = this._variantFields.filter((e) => e !== undefined);
  }

  private labelize(field: string) {
    let label = field.charAt(0).toUpperCase() + field.slice(1);
    return label.replace(/([a-z])([A-Z])/, "$1 $2");
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
    await this.service
      .getBatchGenes({ ids: geneIds })
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
      return `${targetFrequency.ac}/${targetFrequency.an} (${roundRelativeFrequency}%)`;
    }
    return "-";
  }

  private getTotalDepth(genotypes: Array<Genotype>) {
    let dp = 0;
    genotypes.forEach((genotype: Genotype) => dp += genotype.altCount + genotype.refCount);
    return `${dp}`;
  }

  private generateVariantLine(variant: Variant): VariantLine {
    const chromosome = this.getChromosomeNameFromId(variant.chromosome);
    const consequenceLine: Array<ConsequenceLine> = this.getConsequenceLines(variant.consequence);
    const genotypeLines: Array<GenotypeLine> = this.getGenotypeLines(variant.reference,
      variant.alternative, variant.genotypes)
    const frequencyLines: Array<FrequencyLine> = this.getFrequencyLines(variant.frequencies);
    const dp: string = this.getTotalDepth(variant.genotypes);
    const gmaf: string = this.getFrequencyByPopulationCode(variant.frequencies, "all");
    return {
      id: variant.id,
      snpId: variant.identifier || "-",
      region: `${chromosome}:${variant.position}`,
      allele: `${variant.reference}|${variant.alternative}`,
      consequences: consequenceLine,
      frequencies: frequencyLines,
      dp: dp,
      gmaf: gmaf,
      genotypes: genotypeLines
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
          if (this.variantParams[propertyKey].length == 0) delete this.variantParams[propertyKey];
        } else {
          delete this.variantParams[propertyKey];
        }
        break;
    }
  }

  addGenotypeFilter(genotype: GenotypeFilterParams) {
    let genotypeFilters;
    if (this.variantParams.genotypeFilters != null) {
      genotypeFilters = [...this.variantParams.genotypeFilters, genotype];
    } else {
      genotypeFilters = [genotype];
    }
    this.variantParams = { ...this.variantParams, genotypeFilters: genotypeFilters };
  }

  addFrequencyFilter(frequencyFilters: FrequencyFilterParams[]) {
    const variantFrequencyFilters = this.variantParams.frequencyFilters;
    if (variantFrequencyFilters == null) {
      this.variantParams.frequencyFilters = frequencyFilters;
    } else {
      this.variantParams.frequencyFilters = this.variantParams.frequencyFilters
        .concat(frequencyFilters);
    }
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

  getCsvVariantReportParams(): CsvVariantReportParams {
    const csvVariantReportParams: any = { ...this.variantParams }
    delete csvVariantReportParams.page;
    delete csvVariantReportParams.size;
    return csvVariantReportParams;
  }

  private getConsequenceLineWithHigherImpact(variant: Variant, geneCache: Array<Gene>, biotypeCache: Array<Biotype>,
                                             impactCache: Array<Impact>, effectCache: Array<Effect>): ConsequenceLine {
    const consequenceLines: Array<ConsequenceLineDataSource> = variant.consequence
      .sort((a, b) => b.impact - a.impact)
      .map((consequence: Consequence) => {
        return new ConsequenceLineDataSource(consequence, geneCache, biotypeCache, impactCache, effectCache);
      });
    return consequenceLines[0].line;
  }

  private getConsequenceLines(consequences: Array<Consequence>): Array<ConsequenceLine> {
    const consequenceLines: Array<ConsequenceLine> = consequences
      .map((consequence: Consequence) =>
        new ConsequenceLineDataSource(consequence, this.geneCache,
          this.biotypeCache, this.impactCache, this.effectCache).line);
    return consequenceLines;
  }

  private getGenotypeLines(reference: string, alternative: string, genotypes: Array<Genotype>): Array<GenotypeLine> {
    const genotypeLines: Array<GenotypeLine> = genotypes
      .map((genotype: Genotype) =>
        new GenotypeLineDataSource(reference, alternative, genotype, this.individualCache, this.genotypeTypeCache).line)
    return genotypeLines;
  }

  private getFrequencyLines(frequencies: Array<Frequency>): Array<FrequencyLine> {
    const frequencyLines: Array<FrequencyLine> = frequencies
      .map((frequency: Frequency) => new FrequencyLineDatasource(frequency, this.populationCache).line);
    return frequencyLines;
  }

  deleteFrequencyFilter(targetFrequencyFilter: FrequencyFilterParams[]) {
    if (this.variantParams.frequencyFilters != null) {
      const remainingFrequencyFilters = this.variantParams.frequencyFilters
        .filter(item => {
          return targetFrequencyFilter
            .some(obj => obj.arity === item.arity && obj.population === item.population &&
              obj.operation === item.operation && obj.af === item.af);
      });
      console.log(remainingFrequencyFilters);
      this.variantParams.frequencyFilters = remainingFrequencyFilters;

      if (this.variantParams.frequencyFilters.length === 0) {
        delete this.variantParams.frequencyFilters;
      }
    }
  }
}
