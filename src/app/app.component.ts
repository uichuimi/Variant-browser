import { Component } from '@angular/core';
import { VariantApiService } from './variant-api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'variant-browser';
  data: any = [];

  constructor ( private VariantService: VariantApiService){
    this.getData();
  }
  
  async getData (){
    this.data = await this.VariantService.getApiData();
  }


}
