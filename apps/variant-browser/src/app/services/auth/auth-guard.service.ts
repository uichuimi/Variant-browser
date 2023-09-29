import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { TokenStorageService } from "../api/varcan-service/endpoints/token-storage-service/token-storage.service";
import { Token } from "../api/varcan-service/models/response/Token";
import {GlobalConstants} from "../common/global-constants";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private globalConstants: GlobalConstants, private tokenStorage: TokenStorageService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token: Token = this.tokenStorage.getToken();
    if (token.access_token != 'null' && token.refresh_token != 'null') {
      this.globalConstants.initializeLocalStorage();
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
