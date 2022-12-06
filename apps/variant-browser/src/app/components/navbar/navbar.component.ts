import { Component, OnInit } from '@angular/core';
import {Router, RouterEvent} from '@angular/router';
import {Location} from "@angular/common";
import { VarCanService } from "../../services/api/varcan-service/var-can.service";
import { GlobalConstants } from "../../services/common/global-constants";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private href: string;
  isSignUp: boolean;
  isLogOut: boolean;
  isGoBack: boolean;

  constructor(private location: Location,
              private router: Router,
              private readonly service: VarCanService,
              private readonly globalConstants: GlobalConstants) {
    router.events.subscribe(value => {
      if (value instanceof RouterEvent) {
        this.href = value.url;

        if (this.href === '/' || this.href === '/login') {
          this.isSignUp = true;
          this.isLogOut = false;
          this.isGoBack = false;
        } else if (this.href === '/register') {
          this.isSignUp = false;
          this.isLogOut = false;
          this.isGoBack = true;
        } else {
          this.isSignUp = false;
          this.isLogOut = true;
          this.isGoBack = false;
        }
      }
    });
  }

  ngOnInit(): void {
    this.href = this.router.url;
  }

  logOut() {
    this.service.logout();
    this.globalConstants.disconnect();
  }

}
