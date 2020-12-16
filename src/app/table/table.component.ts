import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { VariantApiService } from '../variant-api.service';


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
  @Input() realEmpty: boolean;
  @Input() downloadLink: any;
  @Output() notifyPage = new EventEmitter;
  @Output() notifyDownload = new EventEmitter;

  selectedData: any;
  cols: any[];
  pageChange: string = "";
  first: number =0;
  rows: number = 5;
  page: number = 1;
  totalPages: number = 0;
  

  ngOnChanges(changes: SimpleChanges) {
    if (this.filtering){
      if(changes.filtering.currentValue == true){
        this.isFiltering();
      }
    }
    if(this.elements && changes.elements){
      if(changes.elements.currentValue != 0){
        this.totalPages = Math.ceil(this.elements/this.rows);
      }
    }

    if (this.filtering && this.elements){
      if (changes.filtering.currentValue == true && !changes.elements){
        this.totalPages = Math.ceil(this.elements/this.rows);
      }
    }

    if (this.downloadLink){
      if (changes.downloadLink){
        window.open(this.downloadLink,"_self");
      }
    }

    /*if (changes.realEmpty){
      this.empty = this.realEmpty;
    }*/
  }

  constructor (private VariantService: VariantApiService ){
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

  downloadExcel(){
    this.notifyDownload.emit (true);
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

  isFiltering(){
    this.first = 0;
    this.page = 1;
    this.data = [];
    this.totalPages = 0;
   // this.empty = false;
    this.buttonClicked();
    console.log("Pongo empty a false");
  }

  receivingCloseDetails(event:any){
    this.buttonClicked();
  }
  
  buttonClicked(){
    this.selectedData = null;
  }

}

