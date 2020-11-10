import { Component, OnInit, Input } from '@angular/core';
import { VariantApiService } from '../variant-api.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  data: any = [];
  selectedData: any;

  
  constructor ( private VariantService: VariantApiService){
    this.getData();
    
  }
  ngOnInit(): void {
   
  }

  async getData (){
    this.data = await this.VariantService.getApiData();
    this.adjustingData();
  }


  adjustingData(){
    this.data.forEach(each => {
        each.gmaf = Math.max.apply (null, each.frequencies.map(frequencie => {return frequencie.value}));
        each.pos = new Intl.NumberFormat("en-GB").format(each.pos);
        each.frequencies.forEach(frequencie => {
          /*switch (frequencie.population){
            case 'AFR':
              frequencie.population = "African";
            break;
            case 'AMR':
              frequencie.population = "American";
            break;
            case 'EAS':
              frequencie.population = "East Asian";
            break;
            case 'NFE':
              frequencie.population = "Non-Finnish European";
            break;
            case 'FIN':
              frequencie.population = "Finnish";
            break;
            case 'ASJ':
              frequencie.population = "Ashkenazi Jewish";
            break;
            case 'OTH':
              frequencie.population = "Other";
            break;
            case 'EUR':
              frequencie.population = "European";
            break;
            case 'SAS':
              frequencie.population = "South Asian";
            break;
          }*/
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

  selectData (eachData: any){
    this.selectedData = eachData;
  }

  /*  <-- Métodos para la paginación más avanzada -->   
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }


  isLastPage(): boolean {
    return this.data ? this.first === (this.data.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.data ? this.first === 0 : true;
  }

  */
  /* -- https://www.primefaces.org/primeng/showcase/#/table/rowgroup --*/  

}
