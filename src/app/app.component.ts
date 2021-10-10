import {Component, OnInit} from '@angular/core';
import { VariantApiService } from './variant-api.service';
import {environment} from '../environments/environment';
import {TokenStorageService} from './services/token-storage.service';
import {HomeComponent} from './home/home.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  username: string;

  constructor(private tokenStorageService: TokenStorageService) {  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.username = user.username;
    }
  }

  logout() {
    this.tokenStorageService.signout();
    window.location.reload();
  }
}
