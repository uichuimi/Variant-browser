import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  private service: VarCanService;

  constructor() { }

  ngOnInit(): void {
    this.service = new VarCanService(environment.serverUrl)
  }

}
