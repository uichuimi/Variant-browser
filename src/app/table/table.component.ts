import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() data: any;
  @Input() totalPages: any;
  @Input() currentPage: any;
  @Output() notifyPage = new EventEmitter;
  selectedData: any;
  cols: any[];
  pageChange: any = "";
  someClick: boolean = false;
  first: number =0;
  rows: number = 5;
  disabledNext: boolean = false;
  disabledPrev: boolean = true;

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
    console.log(this.selectedData);
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
    if (this.data.length != 0 && this.data != undefined && this.currentPage <= this.totalPages){
    this.buttonClicked();
    this.disabledPrev = false;
    if (this.isRealLastPage() == false && this.isLastPage() == true){
      this.pageChange = "next";
      this.notifyPage.emit(this.pageChange);
      this.data = [];
      this.pageChange = "";
      this.first = 0;
    } else if (this.isRealLastPage() == false){
      this.first = this.first + this.rows;
    } else if (this.isRealLastPage() == true){
      this.disabledNext = true;
    }    
  }
  console.log("Avanzo");
  console.log(this.first);
  console.log(this.rows);
  console.log("Realidad");
  console.log(this.totalPages);
  console.log(this.currentPage);
  }

  prev() {
    if (this.data.length != 0 && this.data != undefined){
    this.buttonClicked();
    if (this.isRealFirstPage() == false && this.isFirstPage() == true){
    this.pageChange = "prev";
    this.notifyPage.emit(this.pageChange);
    this.data = [];
    this.pageChange = "";
    this.first = 60 - this.rows;
    } else if (this.isRealFirstPage() == false){
      this.first = this.first - this.rows;
    } else if (this.isRealFirstPage() == true){
      this.disabledPrev = true;
    }    
  }
    console.log("Retrocedo");
    console.log(this.first);
    console.log(this.rows);
    console.log("Realidad");
    console.log(this.totalPages);
    console.log(this.currentPage);
  }

  buttonClicked(){
    this.someClick = true;
    this.selectedData = null;
  }

  isLastPage(): boolean {
    return this.data ? this.first === (this.data.length - this.rows): true;
  }

  isRealLastPage(): boolean {
    return this.data ? this.first === (this.data.length - this.rows) && this.currentPage == this.totalPages: true;
  }

  isFirstPage(): boolean {
      return this.data ? this.first === 0 : true;
  }

  isRealFirstPage(): boolean {
    return this.data ? this.first === 0 && this.currentPage == 0 : true;
  }

  receivingCloseDetails(event:any){
    this.selectedData = null;
  }
}

