import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Individual} from "../../services/api/varcan-service/models/response/Individual";
import {GlobalConstants} from "../../services/common/global-constants";

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

  constructor(private globalConstants: GlobalConstants) {
    this.visible = false;
    this.availableSamples = this.globalConstants.getIndividuals();
  }

  async download() {
    this.visible = false;
    this.dialogStateUpdated.emit(this.visible);
  }

  cancel() {
    this.visible = false;
    this.dialogStateUpdated.emit(this.visible);
  }
}
