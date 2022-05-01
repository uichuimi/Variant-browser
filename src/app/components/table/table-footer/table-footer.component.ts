import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-footer',
  templateUrl: './table-footer.component.html',
  styleUrls: ['./table-footer.component.css']
})
export class TableFooterComponent {
  visible = true;
  pageNumber = 1;

  @Input() filteredElements = 0;
  @Input() first;
  @Input() initial;
  @Input() last;
  @Input() final;
  @Input() totalPages;
  @Input() numberOfElements;

  @Output() nextPageEvent = new EventEmitter();
  @Output() prevPageEvent = new EventEmitter();
  @Output() firstPageEvent = new EventEmitter();
  @Output() lastPageEvent = new EventEmitter();

  nextPage() {
    this.pageNumber += 1;
    this.nextPageEvent.emit();
  }

  prevPage() {
    this.pageNumber -= 1;
    this.prevPageEvent.emit();
  } 
  
  firstPage() {
    this.pageNumber = 1;
    this.firstPageEvent.emit();
  }

  lastPage() {
    this.pageNumber = this.totalPages;
    this.lastPageEvent.emit();
  }  
}
