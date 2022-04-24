import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private router: Router) { }

  submit(register) {
    const navigationDetails: string[] = ['/login'];

    if(!register.invalid) {
      console.log("valid");
      this.router.navigate(navigationDetails);      
    }
    console.log("Form submitted: ", register);
  }

}
