import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-footer',
  templateUrl: './table-footer.component.html',
  styleUrls: ['./table-footer.component.css']
})
export class TableFooterComponent {
  visible = true;

  @Input() filteredElements = 0;
}
