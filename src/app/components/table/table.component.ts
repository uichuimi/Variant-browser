import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { VariantApiService } from '../../services/variant-api.service';
import { Observable, Subscription } from "rxjs/Rx";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() variants: any[];
  @Input() currentPage: number;
  @Input() elements: number;
  @Input() size: number;
  @Input() filtering: boolean;
  @Input() realEmpty: boolean;
  @Input() downloadLink: any;
  @Output() notifyPage = new EventEmitter;
  @Output() notifyDownload = new EventEmitter;

  @Input() updated: boolean;
  @Input() exSize: number;

  private eventSubscription: Subscription;
  @Input() event: Observable<void>;

  selectedVariants: any;
  cols: any[];
  pageChange: string = "";
  first: number = 0;
  rows: number = 10;
  page: number = 1;
  totalPages: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (this.filtering) {
      if (changes.filtering.currentValue) {
        this.isFiltering();
      }
    }
    if (this.elements && changes.elements) {
      if (changes.elements.currentValue != 0) {
        this.totalPages = Math.ceil(this.elements / this.rows);
      }
    }

    if (this.filtering && this.elements) {
      if (changes.filtering.currentValue && !changes.elements) {
        this.totalPages = Math.ceil(this.elements / this.rows);
      }
    }

    if (this.downloadLink) {
      if (changes.downloadLink) {
        window.open(this.downloadLink, "_self");
      }
    }
  }

  constructor(private VariantService: VariantApiService) {
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
    this.eventSubscription = this.event.subscribe(() =>{
      if (this.first > Math.round((this.exSize/2))) {
        console.log("ENTRO");
        this.first = this.first - 100;
      }else{
        console.log("maybe?");
        this.first = this.first + 100;
      }
    });
  }

  selectVariant(eachVariant: any) {
    this.selectedVariants = eachVariant;
  }


  showAlt(eachVariant: any) {
    this.variants.forEach(element => {
      if (element == eachVariant) {
        eachVariant.showAlt = true;
      }
    });
  }

  hideAlt(eachVariant: any) {
    this.variants.forEach(element => {
      if (element == eachVariant) {
        eachVariant.showAlt = false;
      }
    });
  }

  showRef(eachVariant: any) {
    this.variants.forEach(element => {
      if (element == eachVariant) {
        eachVariant.showRef = true;
      }
    });
  }

  hideRef(eachVariant: any) {
    this.variants.forEach(element => {
      if (element == eachVariant) {
        eachVariant.showRef = false;
      }
    });
  }

  downloadExcel() {
    this.notifyDownload.emit(true);
  }


  isFiltering() {
    this.first = 0;
    this.page = 1;
    this.variants = [];
    this.elements = 0;
    this.totalPages = 0;
    this.clearSelection();
  }

  receivingCloseDetails(event: any) {
    this.clearSelection();
  }

  clearSelection() {
    this.selectedVariants = null;
  }


  //<-- Métodos para la paginación -->   

  next() {
    console.log(this.first + " Y " + Math.round((this.exSize/5)*3));
    if (this.variants.length != 0 && this.variants != undefined) {
      this.clearSelection();
      if (!this.isRealLastPage() && this.isLastPage()) {
        this.pageChange = "next";
        this.notifyPage.emit(this.pageChange);
        this.variants = [];
        this.pageChange = "";
        this.first = 0;
        this.page += 1;        
      } else if (!this.isRealLastPage()) {
        this.first = this.first + this.rows;
        this.page += 1;
        if (this.first >= Math.round((this.exSize/5)*3) && this.updated) {
          console.log("entro");
          this.pageChange = "next";
          this.notifyPage.emit(this.pageChange);
        }
      }
    }
  }

  prev() {

    if (this.variants.length != 0 && this.variants != undefined) {
      this.clearSelection();
      if (!this.isRealFirstPage() && this.isFirstPage()) {
        this.pageChange = "prev";
        this.notifyPage.emit(this.pageChange);
        this.variants = [];
        this.pageChange = "";
        this.page -= 1;
        this.first = this.size - this.rows;
      } else if (!this.isRealFirstPage()) {
        this.first = this.first - this.rows;
        this.page -= 1;
        if (this.first <= Math.round((this.exSize/5)*2) && this.updated) {
          console.log("entro");
          this.pageChange = "prev";
          this.notifyPage.emit(this.pageChange);
        }
      }
    }
  }

  firstPage(){
    this.notifyPage.emit("first");
    this.variants = [];
    this.pageChange = "";
    this.first = 0;
    this.page = 0; 
  }

  lastPage(){
    this.notifyPage.emit("last");
    this.variants = [];
    this.pageChange = "";
    this.first = 0;
    this.page = this.totalPages; 
  }

  isLastPage(): boolean {
    //Cache LOGICA AQUI
    return this.first === (this.variants.length - this.rows);
  }

  isRealLastPage(): boolean {
    //Las page from the results
    var math = Math.ceil((this.elements * (this.size / this.rows)) / this.size);
    return (this.page == math);
  }

  isFirstPage(): boolean {
    return (this.first === 0);
  }

  isRealFirstPage(): boolean {
    return (this.first === 0 && this.currentPage == 0);
  }

}
