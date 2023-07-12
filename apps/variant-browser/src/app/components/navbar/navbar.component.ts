import { Component, OnInit } from '@angular/core';
import {Router, RouterEvent} from '@angular/router';
import {Location} from "@angular/common";
import { VarcanService } from "../../services/api/varcan-service/varcan.service";
import { TokenStorageService } from "../../services/api/varcan-service/endpoints/token-storage-service/token-storage.service";
import { Token } from "../../services/api/varcan-service/models/response/Token";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent /*implements OnInit*/ {
  private href: string;
  isSignUp: boolean;
  isLogOut: boolean;
  isGoBack: boolean;

  constructor(private router: Router,
              private tokenStorage: TokenStorageService,
              private service: VarcanService) {
    router.events.subscribe(value => {
      if (value instanceof RouterEvent) {
        if (this.isLoggedIn()) {
          this.isGoBack = false;
          this.isSignUp = false;
          this.isLogOut = true;
        } else if (!this.isLoggedIn() && value.url == 'register') {
          this.isGoBack = true;
          this.isSignUp = false;
          this.isLogOut = false;
        } else if (!this.isLoggedIn()) {
          this.isGoBack = false;
          this.isSignUp = true;
          this.isLogOut = false;
        }
      }
    });
  }

  private isLoggedIn() {
    const token: Token = this.tokenStorage.getToken();
    return token.refresh_token != null && token.access_token != null;
  }

  /*ngOnInit(): void {
    this.href = this.router.url;
  }*/

  logOut() {
    this.service.logout();
  }

}
