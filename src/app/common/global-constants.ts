import { environment } from 'src/environments/environment';

// MODELS
import { Chromosome } from '../models/output/Chromosome';
import { Impact } from '../models/output/Impact';
import { Effect } from '../models/output/Effect';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

export class GlobalConstants {
    private static service: VarCanService = new VarCanService(environment.serverUrl);
    private static ID_POPULATION_GCA: number;
    private static ID_POPULATION_ALL: number;
    
    static getService(): VarCanService {
      return GlobalConstants.service;
    }

/*     static getPopulationIds() {
      this.service.getPopulations().then(response => {

      })
    } */
    static setChromosomes() {
      this.service.getChromosomes().then(response => {
        localStorage.setItem('chromosomes', JSON.stringify(response.data));
      }).catch(error => console.log("Chromosomes error: " + error));
    }

    static getChromosomes(): Chromosome[] {
      return JSON.parse(localStorage.getItem('chromosomes'));
    }

    static setImpacts() {
      this.service.getImpacts().then(response => {
        localStorage.setItem('impacts', JSON.stringify(response.data));
      }).catch(error => console.log("Impacts error: " + error));
    }  
    
    static getImpacts(): Impact[] {
      return JSON.parse(localStorage.getItem('impacts'));
    }   
    
    static setEffects() {
      this.service.getEffects().then(response => {
        localStorage.setItem('effects', JSON.stringify(response.data));
      }).catch(error => console.log("Effects error: " + error));
    }  
    
    static getEffects(): Effect[] {
      return JSON.parse(localStorage.getItem('effects'));
    }     
}
