import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * prueba AppComponent Class
 */
export class AppComponent {
  title = 'Prueba';

  logOut() {
    sessionStorage.clear();
    localStorage.clear();
  }
}
