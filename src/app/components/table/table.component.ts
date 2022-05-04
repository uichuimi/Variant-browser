import { Component, OnInit } from '@angular/core';

// CONSTANTS
import { GlobalConstants } from 'src/app/common/global-constants';

// MODELS
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

  variants: Array<Variant>;
  dp: Array<number> = [];
  localFrequency: Array<String> = [];
  globalFrequency: Array<String> = [];
  geneSymbols: Array<String> = [];
  ucsc: Array<String> = [];
  effect: Array<String> = [];
  filteredElements: number;

  loading = true;                 // LLAMADA VARIANTS CARGANDO
  showVariantSymbol = false;      // RATÓN SOBRE ALTERNATIVE O REFERENCE CON MÁS DE 6 CARACTERES
  variantToShow = "";             // ALTERNATIVE Y REFERENCE COMPLETA
  selectedVariant: Variant;

  // CONTROL DE PÁGINA ACTUAL
  initial: number = 0;
  final: number = 20;
  page: number = 0;
  pageNumber: number = 1;
  first: boolean = true; 
  last: boolean = false;
  totalPages: number;
  numberOfElements: number;

  ngOnInit(): void {
    let container = document.getElementById('refAltContainer');
    container.style.display = 'none';

    this.service = GlobalConstants.getService();
    this.chromosomesList = GlobalConstants.getChromosomes();
    this.effectsList = GlobalConstants.getEffects();
    this.getVariants();
  }

  getVariants(callbackFunction?) {
    this.service.getVariants({size: 200, page: this.page}).then(response => {
      this.loading = false;
      this.first = response.data.first;
      this.last = response.data.last;
      this.totalPages = response.data.totalPages;
      this.numberOfElements = response.data.numberOfElements;     // NÚMERO DE ELEMENTOS EN LA PÁG.
      this.filteredElements = response.data.totalElements;        // NÚMERO DE ELEMENTOS EN TODAS LAS PÁGS.
      this.variants = response.data.content;
      
      var props = this;
      if (callbackFunction) callbackFunction(props);     // CALCULAR ÍNDICES PARA ÚLTIMA PÁG.

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

  // CALCULAR INICIO, FIN Y NUM. DE PÁG. CUANDO SE VA A LA ÚLTIMA PÁG.
  calculateLastPageIndexes(props) {
    props.initial = props.numberOfElements-(props.numberOfElements % 20);
    props.final = props.numberOfElements;
    props.pageNumber = (props.totalPages - 1) * 10 + props.adjustPageNumber(props.initial);
  }
  
  // AJUSTAR NUM. DE PÁG QUE SE MUESTRA EN PIE DE PÁGINA
  adjustPageNumber(number): number {
    switch(number) {
      case 0:
        return 1;
      case 20:
        return 2;
      case 40:
        return 3;
      case 60:
        return 4;
      case 80:
        return 5;
      case 100:
        return 6;
      case 120:
        return 7;
      case 140:
        return 8;
      case 160:
        return 9;
      case 180:
        return 10;
    }
  }

  selectVariant(variant: Variant) {
    if(this.selectedVariant === variant) {
      this.selectedVariant = null;
      return;
    }
    this.selectedVariant = variant;
  }

  // CONTROL DE EVENTOS
  mouseOver(event,ref,alt) {
    let container = document.getElementById('refAltContainer');
    // STORE MOUSE POSITION 
    var positionX = event.pageX - 100;
    var positionY = event.pageY + 30;
    console.log("position: " + container.offsetWidth);

    container.style.left = positionX + 'px';
    container.style.top = positionY + 'px';
    container.style.display = 'block';

    this.variantToShow = ref + " / " + alt;
    console.log("variantToShow: " + this.variantToShow);
  }

  mouseLeave() {
    let container = document.getElementById('refAltContainer');
    container.style.display = 'none';
  }

  nextPage() {
    this.pageNumber += 1;
    this.initial += 20;
    this.final += 20;

    // SI EN LA ÚLTIMA PÁG. SE SOBREPASA EL NUM. DE ELEMENTOS LO AJUSTAMOS
    if(this.last && this.final > this.numberOfElements) this.final = this.numberOfElements;

    if(this.final % 220 === 0) {
      this.loading = true;
      this.page += 1;
      this.initial = 0;
      this.final = 20;      
      this.getVariants();
    }
  }

  prevPage() {
    this.pageNumber -= 1;
    if(this.initial === 0) {
      this.loading = true;
      this.page -= 1;
      this.initial = 180;
      this.final = 200;      
      this.getVariants();
    } else {
      this.final = this.initial;
      this.initial -= 20;
    }
  }  

  firstPage() {
    this.pageNumber = 1;
    this.loading = true;
    this.initial = 0;
    this.final = 20;
    this.page = 0;
    this.getVariants();
  }

  lastPage() {
    this.loading = true;
    this.page = this.totalPages - 1;
    this.getVariants(this.calculateLastPageIndexes);
  }
}
