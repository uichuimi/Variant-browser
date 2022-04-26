import { Component } from '@angular/core';
import { Router } from '@angular/router';

// SERVICES
import { LoginService } from 'src/app/services/varcan-service/login-service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) { }

  submit(login) {
    const navigationDetails: string[] = ['/variants'];
    console.log("valid/invalid: " + login.invalid);

    if(!login.invalid) {
      console.log("valid");
      this.router.navigate(navigationDetails);
    }
    console.log("Form submitted", login);
  }

}
