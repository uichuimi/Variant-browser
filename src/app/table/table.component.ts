import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() data: any[];
  @Input() currentPage: number;
  @Input() elements: number;
  @Input() size: number;
  @Input() filtering: boolean;
  @Output() notifyPage = new EventEmitter;

  selectedData: any;
  cols: any[];
  pageChange: string = "";
  first: number =0;
  rows: number = 5;
  page: number = 1;
  totalPages: number = 0;

  constructor ( ){
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

  ngOnInit(): void {
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
   
    if (this.data.length != 0 && this.data != undefined){
    this.buttonClicked();
    if (this.isRealLastPage() == false && this.isLastPage() == true){
      this.pageChange = "next";
      this.notifyPage.emit(this.pageChange);
      this.data = [];
      this.pageChange = "";
      this.first = 0;
      this.page += 1;
    } else if (this.isRealLastPage() == false){
      this.first = this.first + this.rows;
      this.page += 1;
    }   
  }
  }

  prev() {
  
    if (this.data.length != 0 && this.data != undefined){
    this.buttonClicked();
    if (this.isRealFirstPage() == false && this.isFirstPage() == true){
    this.pageChange = "prev";
    this.notifyPage.emit(this.pageChange);
    this.data = [];
    this.pageChange = "";
    this.page -= 1;
    this.first = this.size - this.rows;
    } else if (this.isRealFirstPage() == false){
      this.first = this.first - this.rows;
      this.page -= 1;
    }   
  }
  }

  isLastPage(): boolean {
    var result= false;
    if (this.first === (this.data.length - this.rows)){
      result = true;
    }
    return result;
  }

  isRealLastPage(): boolean {
    var result = false;
    var math = Math.ceil((this.elements*(this.size / this.rows)) / this.size);
    if (this.page == math-1){
      result = true;
    }
    return result;
  }

  isFirstPage(): boolean {
    var result = false;
    if (this.first === 0){
      result = true;
    }
      return result;
  }

  isRealFirstPage(): boolean {
    var result = false;
    if (this.first === 0 && this.currentPage == 0){
      result = true;
    }
    return result;
  }

  // <-------------------------------------------------------------->

  receivingCloseDetails(event:any){
    this.buttonClicked();
  }
  
  buttonClicked(){
    this.selectedData = null;
  }

}

