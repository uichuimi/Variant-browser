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

  updated: any = false;

  chromosome: any;
  posMin: any;
  posMax: any;
  gene: any;
  sift: any;
  polyphen: any;
  biotype: any;
  term: any;
  gmaf: any;

  eventSubscriber: Subject<void> = new Subject<void>();

  notifyChild(){
    this.eventSubscriber.next();
  }

  receivingDownload(event: any) {
    this.exportLink();
  }

  async receivingPageChange(event: any) {
    if (event == "next") {
      
    } else if (event == "prev") {
      
    }
    switch (event) {
      case "next":
        this.page += 1;
        this.getData();
        break;
      case "prev":
        this.page -= 1;
        this.getData();
        break;
      case "first":
        this.page = 0;
        this.getData();
        break;
      case "last":
        this.page = 89585;
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
    this.term = event.term;
    this.gmaf = event.gmaf;
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
      this.gene, this.sift, this.polyphen, this.biotype, this.term, this.gmaf);
    this.filtering = false;
    this.apiData = this.incomeData.data;
    this.elements = this.incomeData.elements;
    this.empty = this.incomeData.empty;
    if (this.incomeData.edited) {
      this.notifyChild();
    }
    this.updated = true;
  }

  async exportLink() {
    this.downloadLink = "";
    let url = 'http://193.145.155.148:9090/download/variants?';
    if (this.chromosome != undefined) {
      url += 'chrom=' + this.chromosome + '&';
    }
    if (this.posMin != undefined && this.posMin != null) {
      url += 'start=' + this.posMin + '&';
    }
    if (this.posMax != undefined && this.posMax != null) {
      url += 'end=' + this.posMax + '&';
    }
    if (this.gene != undefined && this.gene != "") {
      url += 'genes=' + this.gene + '&';
    }
    if (this.sift != undefined) {
      url += 'sift=' + this.sift + '&';
    }
    if (this.polyphen != undefined) {
      url += 'polyphen=' + this.polyphen + '&';
    }
    if (this.biotype != undefined) {
      url += 'biotypes=' + this.biotype + '&';
    }
    if (this.term != undefined) {
      url += 'terms=' + this.term + '&';
    }
    if (this.gmaf != undefined && this.gmaf != null) {
      url += 'maxAlleleFrequency=' + this.gmaf + '&';
    }
    this.downloadLink = url.substring(0, url.length - 1);
    console.log(this.downloadLink);
  }

  
}
