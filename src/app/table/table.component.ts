import { Component, OnInit, Input } from '@angular/core';
import { VariantApiService } from '../variant-api.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  data: any = [];
  first: number = 0;
  rows: number = 5;
  selectedData: any;
  
  constructor ( private VariantService: VariantApiService){
    this.getData();
  }
  ngOnInit(): void {
  }

  async getData (){
    this.data = await this.VariantService.getApiData();
    console.log (this.data);

  }

  reset() {
      this.first = 0;
      console.log(this.data);
      console.log(this.rows);
      console.log(this.first);
  }

  selectData (eachData: any){
    console.log({eachData});
    this.selectedData = eachData;
    console.log(this.data);
  }

  

}
