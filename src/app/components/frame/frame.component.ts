import { Component, EventEmitter } from '@angular/core';
import { VariantApiService } from '../../services/variant-api.service';

import { Variant } from '../../interfaces/interfaces';

import { Subject } from "rxjs/Rx";

@Component({
	selector: 'app-frame',
	templateUrl: './frame.component.html',
	styleUrls: ['./frame.component.css']
})
export class FrameComponent{

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

	totalPages: number = 0;

	eventSubscriber: Subject<void> = new Subject<void>();

	constructor(private VariantService: VariantApiService) {
		this.getData();
	}

	notifyChild(){
    this.eventSubscriber.next();
  }

  receivingDownload(event: any) {
    this.exportLink();
  }

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
		this.mode = event.mode;
		this.cases = event.cases;
		this.controls = event.controls;
		this.VariantService.variantCleaner();
		this.getData();
	}

	async getData() {
		this.totalPages = 0;
		this.elements = 0;
		this.updated = false;
		this.empty = false;
		this.incomeData = await this.VariantService.getApiData(this.page, this.size, this.chromosome, this.posMin, this.posMax,
			this.gene, this.sift, this.polyphen, this.biotype, this.impact, this.gmaf, null, this.mode, this.cases, this.controls);
		this.filtering = false;
		this.apiData = this.incomeData.data;
		this.elements = this.incomeData.elements;
		this.empty = this.incomeData.empty;
		this.lastPage = this.incomeData.totalPages - 1;
		this.totalPages = Math.ceil(this.elements / 10);
		if (this.incomeData.edited) {
			this.notifyChild();
		}
		this.updated = true;
	}

	async exportLink() {
		let x = await this.VariantService.variantDownload(this.page, this.size, this.chromosome, this.posMin, this.posMax,
			this.gene, this.sift, this.polyphen, this.biotype, this.impact, this.gmaf, null, this.mode, this.cases, this.controls);
	}

}
