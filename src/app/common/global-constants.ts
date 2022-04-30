import { environment } from 'src/environments/environment';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

export class GlobalConstants {
    private static service: VarCanService = new VarCanService(environment.serverUrl);
    
    static getService(): VarCanService {
      return GlobalConstants.service;
    }

}
