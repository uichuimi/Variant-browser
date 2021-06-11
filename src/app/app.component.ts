import { Component, EventEmitter } from '@angular/core';
import { VariantApiService } from './services/variant-api.service';

import { Variant } from './interfaces/interfaces';

import { Subject } from "rxjs/Rx";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  page: number = 0;
  elements: number = 0;
  size: number = 100;
  incomeData: any = [];
  apiData: any = [];
  filtering: boolean = false;
  empty: boolean = false;
  downloadLink: any = "";

  lastPage: number;

  updated: any = false;

  chromosome: any;
  posMin: any;
  posMax: any;
  gene: any;
  sift: any;
  polyphen: any;
  biotype: any;
  impact: any;
  gmaf: any;
  mode: any;
  cases: any;
  controls: any;

  downloading: boolean = false;

  eventSubscriber: Subject<void> = new Subject<void>();

  //Notification for the table component when the Variant[] size has changed
  notifyChild(){
    this.eventSubscriber.next();
  }

  receivingDownload(event: any) {
    this.exportLink();
  }

  //Event handler from the table component, when recieves chooses which pagination option was launched
  async receivingPageChange(event: any) {
    switch (event.name) {
      case "change":
      this.page = event.page;
      this.getData();
      break;
      case "first":
      this.page = 0;
      this.VariantService.variantCleaner();
      this.getData();
      break;
      case "last":
      this.page = this.lastPage;
      this.VariantService.variantCleaner();
      this.getData();
      break;
      case "jump":
      this.page = event.page;
      this.VariantService.variantCleaner();
      this.getData();
      break;
    }
  }

  /*
    Method that receives all the filters assigned before a search 
    and then creates a new query for the RestAPI
    */
    receivingFilter(event: any) {
      this.filtering = true;
      this.page = 0;
      this.chromosome = event.chromosome;
      this.posMin = event.posMin;
      this.posMax = event.posMax;
      this.gene = event.gene;
      this.sift = event.sift;
      this.polyphen = event.polyphen;
      this.biotype = event.biotype;
      this.impact = event.impact;
      this.gmaf = event.gmaf;
      this.mode = event.mode,
      this.cases = event.cases,
      this.controls = event.controls
      this.VariantService.variantCleaner();
      this.getData();
    }

    constructor(private VariantService: VariantApiService) {
      this.getData();
    }

  /*
    Method that retrieves the information from an standard query from the RestAPI
    */
    async getData() {
      this.updated = false;
      this.empty = false;
      this.incomeData = await this.VariantService.getApiData(this.page, this.size, this.chromosome, this.posMin, this.posMax,
        this.gene, this.sift, this.polyphen, this.biotype, this.impact, this.gmaf, null, this.mode, this.cases, this.controls);
      this.filtering = false;
      this.apiData = this.incomeData.data;
      this.elements = this.incomeData.elements;
      this.empty = this.incomeData.empty;
      this.lastPage = this.incomeData.totalPages - 1;
      if (this.incomeData.edited) {
        this.notifyChild();
      }
      this.updated = true;
    }

    async exportLink() {
      this.downloading = true;
      let x = await this.VariantService.variantDownload(this.page, this.size, this.chromosome, this.posMin, this.posMax,
        this.gene, this.sift, this.polyphen, this.biotype, this.impact, this.gmaf, null, this.mode, this.cases, this.controls);
      console.log(x);
      this.downloading = false;
    }
  }
