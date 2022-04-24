import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
