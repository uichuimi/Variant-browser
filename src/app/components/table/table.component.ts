import { Component, OnInit } from '@angular/core';

// CONSTANTS
import { GlobalConstants } from 'src/app/common/global-constants';

// MODELS
import { Page } from 'src/app/models/output/Page';
import { Variant } from 'src/app/models/output/Variant';
import { Chromosome } from 'src/app/models/output/Chromosome';
import { Effect } from 'src/app/models/output/Effect';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  private service: VarCanService;
  private chromosomesList: Chromosome[];
  private effectsList: Effect[];

  variants: Page<Variant>;
  dp: Array<number> = [];
  localFrequency: Array<String> = [];
  globalFrequency: Array<String> = [];
  geneSymbols: Array<String> = [];
  ucsc: Array<String> = [];
  effect: Array<String> = [];

  loading = true;
  showVariantSymbol = false;
  variantToShow = "";
  positionX: number;
  positionY: number;

  ngOnInit(): void {
    this.service = GlobalConstants.getService();
    this.chromosomesList = GlobalConstants.getChromosomes();
    this.effectsList = GlobalConstants.getEffects();
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
      this.getCoordinate(response.data);            // OBTENER UCSC
      this.getConsequence(response.data);           // OBTENER CONSECUENCIAS
      console.log("variants: ", this.variants);
    }).catch(error => {
      console.log("variants error: " + error)
    });    
  }

  // MÉTODOS AUXILIARES
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
    let ac: number = 0
    let an: number = 0
    let af: number = 0;

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
      }).catch(error => console.log("BacthGenes error: " + error));
    });
    this.service.getBatchGenes()
  }  

  getCoordinate(data) {
    let chromosomeElement: Chromosome;
    data.content.map(variant => {
      chromosomeElement = this.chromosomesList.find(element => element.id === variant.chromosome);
      this.ucsc.push(chromosomeElement.ucsc);
    });
  }

  getConsequence(data) {
    let effect: Effect;
    data.content.map(variant => {
      effect = this.effectsList.find(element => element.id === variant.consequence[0].effect);
      this.effect.push(effect.name);
    });
  }

  // CONTROL DE EVENTOS
  mouseOver(event,index) {
    // STORE MOUSE POSITION
    console.log('Position X: ' + event.pageX + " Position Y: " + event.pageY);  
    this.positionX = event.pageX;
    this.positionY = event.pageY;

    this.showVariantSymbol = true;  
    this.variantToShow = this.variants.content[index].reference + " / " + this.variants.content[index].alternative;
    console.log("variantToShow: " + this.variantToShow);
  }

  mouseLeave() {
    this.showVariantSymbol = false;
  }
}
