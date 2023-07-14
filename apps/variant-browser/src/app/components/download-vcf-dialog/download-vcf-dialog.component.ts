import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Individual} from "../../services/api/varcan-service/models/response/Individual";
import {GlobalConstants} from "../../services/common/global-constants";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-download-vcf-dialog',
  templateUrl: './download-vcf-dialog.component.html',
  styleUrls: ['./download-vcf-dialog.component.css'],
})
export class DownloadVcfDialogComponent {
  @Input() visible: boolean;
  @Output() dialogStateUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  protected availableSamples: Array<Individual>;
  protected selectedSamples: Array<Individual>;

  constructor(private globalConstants: GlobalConstants, private messageService: MessageService) {
    this.visible = false;
    this.availableSamples = this.globalConstants.getIndividuals();
  }

  async download() {
    this.visible = false;
    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Downloading file...', detail: 'The file is being downloaded' });
    this.dialogStateUpdated.emit(this.visible);
  }

  cancel() {
    this.visible = false;
    this.dialogStateUpdated.emit(this.visible);
  }
}
