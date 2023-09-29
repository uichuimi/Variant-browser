import {Injectable} from "@angular/core";
import {VariantLine} from "../models/variant-line";
import {VarcanService} from "../../api/varcan-service/varcan.service";
import {GlobalConstants} from "../../common/global-constants";
import {Page} from "../../api/varcan-service/models/response/Page";
import {Variant} from "../../api/varcan-service/models/response/Variant";
import {VariantParams} from "../../api/varcan-service/models/request/variant-params";
import {Chromosome} from "../../api/varcan-service/models/response/Chromosome";
import {Gene} from "../../api/varcan-service/models/response/Gene";
import {Consequence} from "../../api/varcan-service/models/response/Consequence";
import {Population} from "../../api/varcan-service/models/response/Population";
import {Frequency} from "../../api/varcan-service/models/response/Frequency";
import {Genotype} from "../../api/varcan-service/models/response/Genotype";
import {GenotypeFilterParams} from "../../api/varcan-service/models/request/genotype-filter-params";
import {ConsequenceLineDataSource} from "./consequence-line-datasource/consequence-line-data-source";
import {LazyLoadEvent} from "primeng/api";
import {Observable, Subject} from "rxjs";
import {GenotypeLineDataSource} from "./genotype-line-datasource/genotype-line-data-source";
import {GenotypeLine} from "../models/genotype-line";
import {ConsequenceLine} from "../models/consequence-line";
import {FrequencyLine} from "../models/frequency-line";
import {FrequencyLineDatasource} from "./frequency-line-datasource/frequency-line-datasource";
import {CsvVariantReportParams} from "../../api/varcan-service/models/request/csv-variant-report-params";
import {FrequencyFilterParams} from "../../api/varcan-service/models/request/frequency-filter-params";
import {RegionFilterParams} from "../../api/varcan-service/models/request/region-filter-params";

const DECIMAL_CIPHER_APROXIMATION = 5;

@Injectable({
  providedIn: "root"
})
export class VariantLineDatasourceService {
  private _totalRecords: number;
  private _variantFields: Array<{name: string, label: string, show:boolean}>;
  private variants: Array<Variant>;
  private cachedVariantLines;
  private variantParams: VariantParams;
  private geneCache: Array<Gene>;
  private dataSubject = new Subject<any>();
  data$: Observable<any> = this.dataSubject.asObservable();

  constructor(private readonly service: VarcanService,
              private readonly globalConstants: GlobalConstants) {
    this._totalRecords = 0;
    this._variantFields = [];
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
    const data = this.cachedVariantLines;
    this.dataSubject.next(data);
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
          innerFieldNames = this.globalConstants.populations
            .map(population => population.code).concat(['population']);
        } else if (field === 'genotypes') {
          innerFieldNames = this.globalConstants.individuals.map(individual => individual.code);
        } else {
          if(this.cachedVariantLines[0][field][0]) {
            innerFieldNames = Object.keys(this.cachedVariantLines[0][field][0]);
          } else {
            innerFieldNames = []
          }
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
    const chromosomeList: Array<Chromosome> = this.globalConstants.chromosomes;
    if (chromosomeList != null) {
      const targetChromosome: Chromosome = chromosomeList.find((chromosome: Chromosome) => chromosome.id === chromosomeId);
      return targetChromosome[nameType] || "-";
    } else {
      return "-";
    }
  }

  private getPopulationIdFromCode(populationCode: string): number {
    const populationList: Array<Population> = this.globalConstants.populations;
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
    this.variantParams = {...this.variantParams, [propertyKey]: value, page: 0};
  }

  deletePropertyFilter(propertyKey: string, value: any){
    const allEntities = this.variantParams[propertyKey];
    if (allEntities !== undefined) {
      this.variantParams[propertyKey] = this.variantParams[propertyKey]
        .filter((id: number) => !value.includes(id));
      if (this.variantParams[propertyKey].length == 0) delete this.variantParams[propertyKey];
    } else {
      delete this.variantParams[propertyKey];
    }
    this.variantParams.page = 0;
  }

  addGenotypeFilter(genotype: GenotypeFilterParams) {
    let genotypeFilters;
    if (this.variantParams.genotypeFilters != null) {
      genotypeFilters = [...this.variantParams.genotypeFilters, genotype];
    } else {
      genotypeFilters = [genotype];
    }
    this.variantParams = { ...this.variantParams, genotypeFilters: genotypeFilters, page: 0 };
  }

  addFrequencyFilter(frequencyFilters: FrequencyFilterParams[]) {
    const variantFrequencyFilters = this.variantParams.frequencyFilters;
    if (variantFrequencyFilters == null) {
      this.variantParams.frequencyFilters = frequencyFilters;
    } else {
      this.variantParams.frequencyFilters = this.variantParams.frequencyFilters
        .concat(frequencyFilters);
    }
    this.variantParams.page = 0;
  }

  addRegionFilter(regionFilters: RegionFilterParams[]) {
    const variantRegionFilters = this.variantParams.regionFilters;
    if (variantRegionFilters == null) {
      this.variantParams.regionFilters = regionFilters;
    } else {
      this.variantParams.regionFilters = this.variantParams.regionFilters
        .concat(regionFilters);
    }
    this.variantParams.page = 0;
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
    this.variantParams.page = 0;
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

  private getConsequenceLines(consequences: Array<Consequence>): Array<ConsequenceLine> {
    const consequenceLines: Array<ConsequenceLine> = consequences
      .map((consequence: Consequence) =>
        new ConsequenceLineDataSource(consequence, this.geneCache,
          this.globalConstants.biotypes, this.globalConstants.impacts, this.globalConstants.effects).line);
    return consequenceLines;
  }

  private getGenotypeLines(reference: string, alternative: string, genotypes: Array<Genotype>): Array<GenotypeLine> {
    const genotypeLines: Array<GenotypeLine> = genotypes
      .map((genotype: Genotype) =>
        new GenotypeLineDataSource(reference, alternative, genotype, this.globalConstants.individuals,
          this.globalConstants.genotypeTypes).line)
    return genotypeLines;
  }

  private getFrequencyLines(frequencies: Array<Frequency>): Array<FrequencyLine> {
    const frequencyLines: Array<FrequencyLine> = frequencies
      .map((frequency: Frequency) => new FrequencyLineDatasource(frequency, this.globalConstants.populations).line);
    return frequencyLines;
  }

  deleteFrequencyFilter(targetFrequencyFilter: FrequencyFilterParams[]) {
    if (this.variantParams.frequencyFilters) {
      this.variantParams.frequencyFilters = this.variantParams.frequencyFilters
        .filter(item => {
          return !targetFrequencyFilter
            .some(obj => {
              console.log(obj.arity, item.arity);
              console.log(obj.population, item.population);
              console.log(obj.operation, item.operation);
              console.log(obj.af, item.af);
              return obj.arity === item.arity &&
                JSON.stringify(obj.population) === JSON.stringify(item.population) &&
                obj.operation === item.operation &&
                (obj.af === item.af || isNaN(obj.af) && isNaN(item.af))
            });
        });

      if (this.variantParams.frequencyFilters.length === 0) {
        delete this.variantParams.frequencyFilters;
      }
    }
    this.variantParams.page = 0;
  }

  deleteRegionFilter(targetRegionFilter: RegionFilterParams[]) {
    if (this.variantParams.regionFilters) {
      this.variantParams.regionFilters = this.variantParams.regionFilters
        .filter(item => {
          return !targetRegionFilter
            .some(obj => {
              return obj.chromosome === item.chromosome &&
                (obj.start === item.start || isNaN(obj.start) && isNaN(item.start)) &&
                (obj.end === item.end || isNaN(obj.end) && isNaN(item.end)) &&
                obj.exclude === item.exclude
            });
        });

      if (this.variantParams.regionFilters.length === 0) {
        delete this.variantParams.regionFilters;
      }
    }
    this.variantParams.page = 0;
  }
}
