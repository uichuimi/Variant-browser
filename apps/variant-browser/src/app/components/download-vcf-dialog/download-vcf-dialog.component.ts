import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GlobalConstants} from "../../services/common/global-constants";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-download-vcf-dialog',
  templateUrl: './download-vcf-dialog.component.html',
  styleUrls: ['./download-vcf-dialog.component.css'],
})
export class DownloadVcfDialogComponent implements OnInit {
  @Input() visible: boolean;
  @Output() dialogStateUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  protected availableSamples: any[];
  protected selectedSamples: any[];
  constructor(private globalConstants: GlobalConstants, private messageService: MessageService) {
    this.visible = false;
  }

  ngOnInit(): void {
    this.availableSamples = this.globalConstants.getIndividuals()
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
    this.visible = false;
    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Downloading file...', detail: 'The VCF file will download soon...' });
    this.dialogStateUpdated.emit(this.visible);
  }

  cancel() {
    this.visible = false;
    this.dialogStateUpdated.emit(this.visible);
  }
}
