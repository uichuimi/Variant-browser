import { Component } from '@angular/core';
import { VariantApiService } from './variant-api.service';
import { OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  page: number = 0;
  elements: number = 0;
  size: number = 60;
  incomeData: any = [];
  apiData: any = [];
  filtering: boolean = false;

  chromosome: any;
  posMin: any;
  posMax: any;
  gene: any;
  sift: any;
  polyphen: any;
  biotype: any;
  term: any;
  gmaf: any;
  
  receivingPageChange (event: any){
    if (event == "next"){
        this.page += 1;
        this.getData();
    } else if (event == "prev"){
        this.page -= 1;
        this.getData();
    }
  }

  receivingFilter (event: any){
    this.filtering = true;
    console.log("Estamos recibiendo");
    this.chromosome = event.chromosome;
    this.posMin = event.posMin;
    this.posMax = event.posMax;
    this.gene = event.gene;
    this.sift = event.sift;
    this.polyphen = event.polyphen;
    this.biotype = event.biotype;
    this.term = event.term;
    this.gmaf = event.gmaf;
    console.log(event);
    this.getData();
  }

  constructor ( private VariantService: VariantApiService){
    this.getData();
    console.log("Constructor");
  }

  async getData (){
    this.incomeData = await this.VariantService.getApiData(this.page, this.size, this.chromosome, this.posMin, this.posMax, 
      this.gene, this.sift, this.polyphen, this.biotype, this.term, this.gmaf);
    this.filtering = false;
    this.apiData = this.incomeData.data;
    this.elements = this.incomeData.elements;
    this.adjustingData();
    console.log("Llamo");
  }
  
  adjustingData(){
    
    this.apiData.forEach(each => {
        //each.gmaf = Math.max.apply (null, each.frequencies.map(frequencie => {return frequencie.value}));
        each.pos = new Intl.NumberFormat("en-GB").format(each.pos);
        each.frequencies.forEach(frequencie => {
          switch(frequencie.source){
            case 'gnomAD_genomes':
              frequencie.source = "GG";
            break;
            case 'gnomAD_exomes':
              frequencie.source = "GE";
            break;
            case 'ExAC':
              frequencie.source = "EX";
            break;
            case '1000_genomes':
              frequencie.source = "1KG";
            break;
          }
        });
        switch(each.polyphen){
          case 'probably_damaging':
            each.polyphen = "probably damaging";
          break;
          case 'possibly_damaging':
            each.polyphen = "possibly damaging";
          break;
        }
        
      });   
    
  }
}
  