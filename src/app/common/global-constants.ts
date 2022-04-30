import { environment } from 'src/environments/environment';

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
}
