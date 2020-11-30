import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() data: any;
  @Output() notifyNext = new EventEmitter;
  @Output() notifyPrev = new EventEmitter;
  selectedData: any;
  page: number = 1;
  first: number = 0;
  rows: number = 20;
  cols: any[];
  nextPage: boolean = false;
  prevPage: boolean = false;

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
    this.nextPage = true;
    this.notifyNext.emit(this.nextPage);
    this.nextPage = false;
    //this.first = this.first + this.rows;
    
  }

  prev() {
    this.prevPage = true;
    this.notifyPrev.emit(this.prevPage);
    this.nextPage = false;
    //this.first = this.first - this.rows;
   
  }

  reset() {
      this.first = 0;
      this.page = 1;
  }

  isLastPage(): boolean {
    return this.data ? this.first === (this.data.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.data ? this.first === 0 : true;
  }



}
