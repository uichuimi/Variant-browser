import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {GlobalConstants} from "../../services/common/global-constants";
import {VariantParams} from "../../services/api/varcan-service/models/request/variant-params";
import {Paginator} from "primeng/paginator";
import {VariantLineDatasourceService} from "../../services/data-source/variant-line/variant-line-datasource.service";
import {VariantLine} from "../../services/data-source/models/variant-line";
import {FrequencyLine} from "../../services/data-source/models/frequency-line";
import {MenuItem, SortEvent} from "primeng/api";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class TableComponent implements OnInit {
  protected loading: boolean = true;
  protected variants: Array<VariantLine>;
  protected selectedVariant: VariantLine;
  protected showVariantFilters: boolean;
  protected showVariantInfoPanel: boolean;
  showCsvDownloadDialog: boolean = false;
  showVcfDownloadDialog: boolean = false;
  protected variantParams: VariantParams;
  protected first: number = 0;
  protected rows: number = 10;
  @ViewChild('paginator', {static: true}) paginator: Paginator;
  cols: any[];
  _selectedColumns: any[];
  protected propertyColumns: any[];
  protected frequencyColumns: any[];
  protected genotypeColumns: any[];
  protected readonly Object = Object;
  protected downloadOptions: MenuItem[] = [
    { label: 'CSV', command: () => this.openCsvDownloadDialog() },
    { label: 'VCF', command: () => this.openShowVcfDownloadDialog() }
  ];

  constructor(private readonly globalConstants: GlobalConstants,
              protected dataSource: VariantLineDatasourceService) {
    this.variantParams = { size: this.rows };
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  ngOnInit(): void {
    this.dataSource.data$.subscribe((data) => {
      this.variants = data;
      if (this.variants.length > 0) {
        this.updatePropertyColumns();
        this.updatedFrequencyColumns();
        this.updateGenotypeColumns()
      }
    });
    this.cols = this.dataSource.variantFields;
    this._selectedColumns = [
      {
        "name": "snpId",
        "label": "Snp Id",
        "show": true
      },
      {
        "name": "region",
        "label": "Region",
        "show": true
      },
      {
        "name": "allele",
        "label": "Allele",
        "show": true
      },
      {
        "name": "dp",
        "label": "Dp",
        "show": true
      },
      {
        "name": "gmaf",
        "label": "Gmaf",
        "show": true
      }
    ];
  }

  loadVariants(event) {
    this.rows = event.rows;
    const dataSourceVariantParams = this.dataSource.getVariantParams();
    if (dataSourceVariantParams != null) this.variantParams = dataSourceVariantParams;
    this.variantParams.page = event.first / event.rows;
    this.variantParams.size = event.rows;

    setTimeout(() => {
      this.dataSource.updateVariantLine(this.variantParams).then((lines) => this.variants = lines);
      this.loading = false;
    }, 1000)

    this.cols = this.dataSource.variantFields;
  }

  private updatePropertyColumns() {
    const baseVariantFields = this.dataSource.variantFields
      .filter(field => Object.keys(this.variants[0]).includes(field.name));
    const consequenceFields: any[] = this.dataSource.variantFields
      .filter(field => Object.keys(this.variants[0].consequences[0]).includes(field.name));
    this.propertyColumns = baseVariantFields.concat(consequenceFields);
  }

  private updatedFrequencyColumns() {
    const populationCodes = this.globalConstants.getPopulation()
      .map(population => population.code);
    this.frequencyColumns = this.dataSource.variantFields
      .filter(field => ['population'].concat(populationCodes).includes(field.name));
  }

  private updateGenotypeColumns() {
    const individualCodes = this.globalConstants.getIndividuals()
      .map(individual => individual.code);
    const baseColumns = [
      {name: 'individual', label: 'Individual', show: true},
      {name: 'genotype', label: 'Genotype', show: true},
      {name: 'refCount', label: 'Reference count', show: true},
      {name: 'altCount', label: 'Alternative count', show: true}
    ]
    this.genotypeColumns = this.dataSource.variantFields
      .filter(field => individualCodes.includes(field.name)).concat(baseColumns);
  }

  protected updateCurrentPage(currentPage: number): void {
    setTimeout(() => this.paginator.changePage(currentPage));
  }

  protected reset() {
    this.first = 0;
  }

  onSort($event: SortEvent) {
    console.log($event);
  }

  protected isSnpId(variant: VariantLine, name: string) {
    return name === 'snpId' && variant.snpId !== '-';
  }

  protected isMainVariantProperty(variant: VariantLine, name: string) {
    if (name === "snpId" && variant.snpId === "-") return true
    else return Object.keys(variant).includes(name) && name !== "snpId";
  }

  protected isGenotype(variant: VariantLine, name: string) {
    if (variant.genotypes[0] === undefined) return false;
    return this.globalConstants.getIndividuals()
        .map(individual => individual.code).includes(name);
  }

  protected extractGenotype(variant: VariantLine, name: string) {
    const targetGenotypeLine = variant.genotypes
      .find(genotypeLine => genotypeLine.individual === name);
    if (targetGenotypeLine === undefined) return "-";
    return targetGenotypeLine[name];
  }

  protected isFrequency(variant: VariantLine, name: string) {
    if (variant.frequencies[0] === undefined) return false;
    return this.globalConstants.getPopulation()
      .map(population => population.code).includes(name)
      || name === 'population';
  }

  protected extractFrequency(variant: VariantLine, name: string) {
    if (name === 'population') {
      return variant.frequencies
        .map(frequency => frequency.population).join(" | ");
    }
    const frequencyLine: FrequencyLine = variant.frequencies
      .find(frequency => frequency.code === name);

    if (frequencyLine === undefined) return "-";

    return frequencyLine[name];
  }

  protected isConsequence(variant: VariantLine, name: string) {
    if (variant.consequences[0] === undefined) return false;
    return Object.keys(variant.consequences[0]).includes(name);
  }

  protected extractConsequence(variant: VariantLine, name: string) {
    return variant.consequences.map(val => val[name]).join(' | ');
  }

  onRowSelect($event: any) {
    this.selectedVariant = $event.data;
    this.showVariantInfoPanel = true;
  }
  onRowUnselect() {
    this.selectedVariant = null;
    this.showVariantInfoPanel = false;
  }

  protected getFilterFields() {
    return [
      "id",
      "snpId",
      "region",
      "allele",
      "dp",
      "gmaf",
      "geneName",
      "ensg",
      "hgnc",
      "ncbi",
      "symbol",
      "biotypeName",
      "biotypeAccession",
      "biotypeDescription",
      "effectName",
      "effectAccession",
      "effectDescription",
      "impact",
      "transcript",
      "sift",
      "hgvsp",
      "hgvsc",
      "polyphen",
      "afr",
      "ami",
      "asj",
      "eas",
      "fin",
      "all",
      "gca",
      "amr",
      "mid",
      "nfe",
      "oth",
      "sas",
      "population"
    ];
  }

  onToggleShowCsvDownloadDialog($event: boolean) {
    this.showCsvDownloadDialog = $event;
  }

  onToggleShowVcfDownloadDialog($event: boolean) {
    this.showVcfDownloadDialog = $event;
  }

  openCsvDownloadDialog() {
    this.showCsvDownloadDialog = true;
  }

  openShowVcfDownloadDialog() {
    this.showVcfDownloadDialog = true;
  }
}
