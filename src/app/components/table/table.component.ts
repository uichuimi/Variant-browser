import { Component, OnInit } from '@angular/core';

// CONSTANTS
import { GlobalConstants } from 'src/app/common/global-constants';

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
  dp: Array<number> = [];
  localFrequency: Array<String> = [];
  globalFrequency: Array<String> = [];
  geneSymbols: Array<String> = [];

  loading = true;

  constructor() { }

  ngOnInit(): void {
    this.service = GlobalConstants.getService();
    this.getVariants();
  }

  getVariants() {
    this.service.getVariants({size: 200}).then(response => {
      this.loading = false;
      this.variants = response.data;

      this.calculateDP(response.data);              // CALCULAR DPs
      this.calculateLocalFrequency(response.data);  // CALCULAR FRECUENCIA LOCAL
      this.calculateGlobalFrequency(response.data); // CALCULAR FRECUENCIA GLOBAL
      this.getGeneSymbol(response.data);            // OBTENER SÍMBOLO DEL GEN
      console.log("variants: ", this.variants);
    }).catch(error => {
      console.log("variants error: " + error)
    });    
  }

  calculateDP(data) {
    let an: number = 0;

    data.content.map((variant) => {
      variant.frequencies.map((frequency) => {
        an += frequency.an;
      });
      this.dp.push(an);
      an = 0;
    });
  }

  calculateLocalFrequency(data) {
    let ac, an, af: number = 0;

    data.content.map((variant) => {
      variant.frequencies.map((frequency) => {
        if(frequency.population === 1) {
          ac = frequency.ac;
          an = frequency.an;
        }
      });
      if(an !== 0) af = ac / an;

      this.localFrequency.push(ac + " / " + an + " (" + af + ")");
      ac = 0;
      an = 0;
      af = 0;
    });  
  }  

  calculateGlobalFrequency(data) {
    let ac, an, af: number = 0;

    data.content.map((variant) => {
      variant.frequencies.map((frequency) => {
        if(frequency.population === 2) {
          ac = frequency.ac;
          an = frequency.an;
        }
      });
      if(an !== 0) af = ac / an;

      this.globalFrequency.push(ac + " / " + an + " (" + af + ")");
      ac = 0;
      an = 0;
      af = 0;
    });  
  }
  
  getGeneSymbol(data) {
    data.content.map(variant => {
      this.service.getBatchGenes({"ids": [variant.consequence[0].gene]}).then(response => {
        this.geneSymbols.push(response.data[0].symbol);       
      })
    });
    this.service.getBatchGenes()
  }  
}

/* let ac: number;
let an: number;
let af: number;    
data.content.map((variant) => {
  variant.frequencies.map((frequency) => {
    if(frequency.population === 1) {
      ac += frequency.ac;
      an += frequency.an;
    }
  });
  af = ac / an;
  this.dp.push(ac + " / " + an + " (" + af + ")");
  ac = 0;
  an = 0;
  af = 0;
}); */
