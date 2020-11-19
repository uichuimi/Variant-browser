import { Component } from '@angular/core';
import { VariantApiService } from './variant-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  apiData: any = [];
  page: number = 1;
  whatMyChildSay(event: any){
    this.getFilteredData(event);
  };

  constructor ( private VariantService: VariantApiService){
    this.getData();
  }

  async getData (){
    this.apiData = await this.VariantService.getApiData(this.page);
    this.adjustingData();
  }

  async getFilteredData(selectedEffect){
    this.apiData = await this.VariantService.getApiFilteredData(selectedEffect);
    this.adjustingData();
  }
  
  adjustingData(){
    this.apiData.forEach(each => {
        each.gmaf = Math.max.apply (null, each.frequencies.map(frequencie => {return frequencie.value}));
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
      console.log(this.apiData);
  }

}
