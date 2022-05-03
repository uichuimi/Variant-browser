import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-footer',
  templateUrl: './table-footer.component.html',
  styleUrls: ['./table-footer.component.css']
})
export class TableFooterComponent {
  visible = true;

  @Input() filteredElements = 0;
  @Input() first;
  @Input() initial;
  @Input() last;
  @Input() final;
  @Input() totalPages;
  @Input() numberOfElements;
  @Input() pageNumber;

  @Output() nextPageEvent = new EventEmitter();
  @Output() prevPageEvent = new EventEmitter();
  @Output() firstPageEvent = new EventEmitter();
  @Output() lastPageEvent = new EventEmitter();

  nextPage() {
    this.nextPageEvent.emit();
  }

  prevPage() {
    this.prevPageEvent.emit();
  } 
  
  firstPage() {
    this.firstPageEvent.emit();
  }

  lastPage() {
    this.lastPageEvent.emit();
  }  
}
