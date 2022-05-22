import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * prueba AppComponent Class
 */
export class AppComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  username: string;

  constructor() {  }

  ngOnInit(): void {

  }

  logout() {

  }
}
