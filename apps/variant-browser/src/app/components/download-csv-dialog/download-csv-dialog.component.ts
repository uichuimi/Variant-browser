import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {GlobalConstants} from "../../services/common/global-constants";
import {VariantLineDatasourceService} from "../../services/data-source/variant-line/variant-line-datasource.service";
import {VarcanService} from "../../services/api/varcan-service/varcan.service";
import {CsvVariantReportParams} from "../../services/api/varcan-service/models/request/csv-variant-report-params";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-download-csv-dialog',
  templateUrl: './download-csv-dialog.component.html',
  styleUrls: ['./download-csv-dialog.component.css'],
  providers: [MessageService]
})
export class DownloadCsvDialogComponent implements OnInit {
  @Input() visible: boolean;
  @Output() dialogStateUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  protected availablePropertyFields: any[] = [
    { name: "PROP.CHROM", label: "CHROM", category: "Property" },
    { name: "PROP.POS", label: "POS", category: "Property" },
    { name: "PROP.ID", label: "ID", category: "Property" },
    { name: "PROP.REF", label: "REF", category: "Property" },
    { name: "PROP.ALT", label: "ALT", category: "Property" },
    { name: "PROP.DP", label: "DP", category: "Property" }
  ];
  protected availableConsequenceFields: any[] = [
    { name: "CONSQ.EFFECT", label: "EFFECT", category: "Consequence" },
    { name: "CONSQ.SYMBOL", label: "SYMBOL", category: "Consequence" },
    { name: "CONSQ.BIOTYPE", label: "BIOTYPE", category: "Consequence" },
    { name: "CONSQ.IMPACT", label: "IMPACT", category: "Consequence" },
    { name: "CONSQ.HGVSc", label: "HGVSc", category: "Consequence" },
    { name: "CONSQ.HGVSp", label: "HGVSp", category: "Consequence" }
  ]
  protected availableFrequencyFields: any[];
  protected availableSampleFields: any[];
  protected selectedPropertyFields: any[] = [
    { name: "PROP.CHROM", label: "CHROM", category: "Property" },
    { name: "PROP.POS", label: "POS", category: "Property" },
    { name: "PROP.ID", label: "ID", category: "Property" },
    { name: "PROP.REF", label: "REF", category: "Property" },
    { name: "PROP.ALT", label: "ALT", category: "Property" },
    { name: "CONSQ.HGVSp", label: "HGVSp", category: "Consequence" }
  ];
  protected selectedConsequenceFields: any[] = [
    { name: "CONSQ.EFFECT", label: "EFFECT", category: "Consequence" },
    { name: "CONSQ.SYMBOL", label: "SYMBOL", category: "Consequence" },
    { name: "CONSQ.BIOTYPE", label: "BIOTYPE", category: "Consequence" },
    { name: "CONSQ.IMPACT", label: "IMPACT", category: "Consequence" },
  ];
  protected selectedFrequencyFields: any[] = [];
  protected selectedSampleFields: any[] = [];
  private variantParams: CsvVariantReportParams;

  constructor(private cdr: ChangeDetectorRef,
              private globalConstants: GlobalConstants,
              private dataSource: VariantLineDatasourceService,
              private service: VarcanService, private messageService: MessageService) {
    this.visible = false;

    this.variantParams = this.dataSource.getCsvVariantReportParams();
  }

  ngOnInit(): void {
    if (this.globalConstants.getPopulation() == null || this.globalConstants.getIndividuals() == null) return;

    this.availableFrequencyFields = this.globalConstants.getPopulation()
      .map((population) => {
        return {
          name: `FREQ.${population.code.toUpperCase()}`,
          label: population.name,
          category: "Frequency"
        };
      });
    this.availableSampleFields = this.globalConstants.getIndividuals()
      .reduce((result, sample) => {
        const group: string = sample.code.toUpperCase().match(/[A-Z]+/)[0];
        const targetGroup = result.find(groupElem => groupElem.group === group);
        const sampleObject = {
          name: `GEN.${sample.code.toUpperCase()}`,
          label: sample.code,
          category: "Genotype"
        }

        if (targetGroup) {
          targetGroup.items.push(sampleObject);
        } else {
          result.push({
            group: group,
            items: [sampleObject]
          })
        }
        return result;
      }, []);
    }

  async download() {
    const properties = this.selectedPropertyFields.map(property => property.name);
    const frequencies = this.selectedFrequencyFields.map(frequency => frequency.name);
    const consequences = this.selectedConsequenceFields.map(consequence => consequence.name);
    const samples = this.selectedSampleFields.map(sample => sample.name);
    const fields: string[] = [].concat(properties, frequencies, consequences, samples);
    this.variantParams = this.dataSource.getCsvVariantReportParams();
    this.variantParams.fields = fields;

    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Downloading file...', detail: 'The CSV file will download soon...' });

    await this.service.downloadCsvReport(this.variantParams).then(response => {
      const csvReport = response.data;
      const url = window.URL.createObjectURL(new Blob([csvReport], { type: 'text/csv' }));
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display:none');
      a.href = url;
      a.download = 'report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
    this.visible = false;
    this.dialogStateUpdated.emit(this.visible);
  }

  cancel() {
    this.visible = false;
    this.dialogStateUpdated.emit(this.visible);
  }
}
