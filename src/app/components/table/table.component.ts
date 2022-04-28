import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

// MODELS
import { Page } from 'src/app/models/output/Page';
import { Variant } from 'src/app/models/output/Variant';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  private service: VarCanService;
  variants: Page<Variant>;
  loading = true;

  constructor() { }

  ngOnInit(): void {
    this.service = new VarCanService(environment.serverUrl);
    this.service.getVariants({size: 200}).then(response => {
      this.variants = response.data;
    }).catch(error => {
      console.log("variants error: " + error)
    });
  }

}
