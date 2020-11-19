import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() data: any;
  selectedData: any;
  page: number = 1;
  first: number = 0;
  rows: number = 20;
  cols: any[];

  constructor ( ){
   
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'identifier', header: 'Identifier' },
      { field: 'coordinate', header: 'Coordinate' },
      { field: 'variant', header: 'Variant' },
      { field: 'gene', header: 'Gene' },
      { field: 'sift', header: 'Sift' },
      { field: 'polyphen', header: 'Polyphen' },
      { field: 'change', header: 'Change' },
      { field: 'gmaf', header: 'GMAF' }
  ];
  }

  selectData (eachData: any){
    this.selectedData = eachData;
  }


  showAlt(eachData: any){
    this.data.forEach(element => {
        if (element == eachData){
          eachData.showAlt = true;
        }
    });
  }

  hideAlt(eachData: any){
    this.data.forEach(element => {
      if (element == eachData){
        eachData.showAlt = false;
      }
  });
  }

  showRef(eachData: any){
    this.data.forEach(element => {
        if (element == eachData){
          eachData.showRef = true;
        }
    });
  }

  hideRef(eachData: any){
    this.data.forEach(element => {
      if (element == eachData){
        eachData.showRef = false;
      }
  });
  }

  //<-- Métodos para descargar la tabla -->
  exportExcel() {
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.data);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "data");
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      import("file-saver").then(FileSaver => {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data: Blob = new Blob([buffer], {
              type: EXCEL_TYPE
          });
          FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      });
  }

  //<-- Métodos para la paginación -->   
  next() {
    /*if (this.isLastPage() == true){
      console.log("Lo pillo");
      this.first = this.first + this.rows;
      this.loadData();
    }*/
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
    console.log(this.first);
    console.log(this.rows);
    console.log(this.page);
    console.log(this.data);
  }

  reset() {
      this.first = 0;
      this.page = 1;
  }

  /*async loadData(){
    console.log("Entro");
    this.page = this.page+1;
    this.data.push( await this.VariantService.getApiData(this.page));
    this.adjustingData();
  } */

  isLastPage(): boolean {
    return this.data ? this.first === (this.data.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.data ? this.first === 0 : true;
  }



}
