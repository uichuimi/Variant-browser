import { Component, OnInit, Input } from '@angular/core';
import { VariantApiService } from '../variant-api.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  data: any = [];
  dataCompleted: any = [];
  first: number = 0;
  rows: number = 10;
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
        each.frequencies.forEach(frequencie => {
          switch (frequencie.population){
            case 'AFR':
              frequencie.population = "África";
            break;
            case 'AMR':
              frequencie.population = "América";
            break;
            case 'EAS':
              frequencie.population = "Este Asiático";
            break;
            case 'NFE':
              frequencie.population = "Europa sin Finlandia";
            break;
            case 'FIN':
              frequencie.population = "Finlandia";
            break;
            case 'ASJ':
              frequencie.population = "Judíos Askenazi";
            break;
            case 'OTH':
              frequencie.population = "Otros";
            break;
            case 'EUR':
              frequencie.population = "Europa";
            break;
            case 'SAS':
              frequencie.population = "Sur Asiático";
            break;
          }
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
