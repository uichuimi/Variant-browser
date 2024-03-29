import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, HostListener } from '@angular/core';
import { VariantApiService } from '../../services/variant-api.service';
import { Observable, Subscription } from "rxjs/Rx";

import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  @Input() downloading: boolean;

  @Input() updated: boolean;
  @Input() exSize: number;

  @Input() totalPages: number;

  private eventSubscription: Subscription;
  @Input() event: Observable<void>;

  selectedVariants: any;
  cols: any[];
  pageChange: string = "";
  first: number = 0;
  rows: number = 10;
  page: number = 1;

  //Variable for the app.component pagination event
  pageModifier = {
    name: '',
    page: 0,
  };

  selectedDetail: number = 0;

  cachePage = 0;

  pointer;

  ngOnChanges(changes: SimpleChanges) {
  }

  //Function for the keyboard shortcutes
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key == "ArrowLeft" && !(this.isRealFirstPage() || this.variants.length == 0 || this.variants == undefined)) {
      this.prev();
      event.preventDefault();
    }else if(event.key == "ArrowRight" && !(this.isRealLastPage() || this.variants.length == 0 || this.variants == undefined)){
      this.next();
      event.preventDefault();
    }else if (event.key == "ArrowUp") {
      if (!this.selectedVariants) {
        this.pointer = this.first+9;
        this.selectedVariants = this.variants[this.pointer];
        event.preventDefault();
      }else if(this.pointer > this.first){
        this.pointer = this.variants.indexOf(this.selectedVariants)-1;
        this.selectedVariants = this.variants[this.pointer]
        event.preventDefault();
      }
    }else if (event.key == "ArrowDown") {
      //event.stopPropagation();
      if (!this.selectedVariants) {
        this.pointer = this.first;
        this.selectedVariants = this.variants[this.pointer];
        event.preventDefault();
      }else if(this.pointer < this.first + 9){
        this.pointer = this.variants.indexOf(this.selectedVariants)+1;
        this.selectedVariants = this.variants[this.pointer];
        event.preventDefault();
      }
    }
  }

  constructor(private VariantService: VariantApiService,
    config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
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
    //Event subscription when detecting that the table size changed in order to stay in the same page
    this.eventSubscription = this.event.subscribe(() =>{
      if (this.first > Math.round((this.exSize/2))) {
        this.first = this.first - 100;
      }else{
        this.first = this.first + 100;
      }
    });
  }

  selectVariant(eachVariant: any) {
    this.selectedVariants = null;
    this.selectedVariants = eachVariant;
  }

  switchDetails(event: any){
    this.selectedDetail = event;
  }

  downloadExcel(content) {
    if (this.elements > 10000) {
      this.modalService.open(content);
    }
    this.notifyDownload.emit(true);
  }

  receivingCloseDetails(event: any) {
    this.clearSelection();
  }

  clearSelection() {
    this.selectedVariants = null;
  }


  //<-- Métodos para la paginación -->   

  next() {
    console.log(this.first + " Y " + Math.floor((this.exSize)*0.8));
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
        if (this.first >= Math.round((this.exSize)*0.8) 
          && this.updated 
          && this.page < this.totalPages - 10) {
          this.pageModifier.name = "change";
        this.pageModifier.page = Math.floor((this.page * 10)/100) + 1;
        this.notifyPage.emit(this.pageModifier);
      }
    }
  }    
}

prev() {
  console.log(this.first + " Y " + Math.floor((this.exSize)*0.2));

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
      if (this.first <= Math.round((this.exSize)*0.2) 
        && this.updated 
        && this.page > 10) {
        this.pageModifier.name = "change";
      this.pageModifier.page = Math.floor((this.page * 10)/100) - 1;
      this.notifyPage.emit(this.pageModifier);
    }
  }
}
}

firstPage(){
  this.clearSelection();
  this.pageModifier.name = "first";
  this.notifyPage.emit(this.pageModifier);
  this.variants = [];
  this.pageChange = "";
  this.first = 0;
  this.page = 1; 
}

lastPage(){
  this.clearSelection();
  this.first = this.elements - ((Math.ceil(this.elements / 100) - 1)*100);
  if (this.first > 10) {
    this.first = Math.floor(this.first/10)*10;
  }else{
    this.first = 0
  }
  this.pageModifier.name = "last";
  this.notifyPage.emit(this.pageModifier);
  this.variants = [];
  this.page = this.totalPages; 
}

searchPage(){
  this.clearSelection();
  this.pageModifier.name = "jump";
  this.pageModifier.page = Math.floor((this.cachePage * 10)/100);
  this.first = 0;
  this.first = (this.cachePage%10)-1;
  if (this.first == -1) {
    this.first = 9;
  }
  this.first = this.first * 10;
  console.log("FIRST = " + this.first);
  this.notifyPage.emit(this.pageModifier);
  this.variants = [];
  this.page = this.cachePage;
}

updatePage(event: any){
  console.log(event.value);
  this.cachePage = event.value;
}

isLastPage(): boolean {
  //Cache LOGICA AQUI
  return this.first === (this.variants.length - this.rows);
}

isRealLastPage(): boolean {
  //Las page from the results
  return (this.page == this.totalPages);
}

isFirstPage(): boolean {
  return (this.first === 0);
}

isRealFirstPage(): boolean {
  return (this.page === 1);
}

}

