import {Component, OnInit} from '@angular/core';
import { VarCanService } from './services/varcan-service/var-can.service';

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

  constructor(private varcanService: VarCanService) {  }

  ngOnInit(): void {
    this.varcanService.getChromosomes();
  }

  logout() {

  }
}
