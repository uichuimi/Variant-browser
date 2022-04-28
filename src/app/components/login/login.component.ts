import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private service: VarCanService;
  loginIncorrect = false;
  loading = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.service = new VarCanService(environment.serverUrl)
  }

  onClick() {
    console.log("sdfdasfa");
    this.loginIncorrect = false;
  }

  submit(login) {
    this.loginIncorrect = false;
    const navigationDetails: string[] = ['/variants'];
    console.log("valid/invalid: " + login.invalid);

    if(!login.invalid) {
      console.log("valid");
      const { username, password } = login.form.value;
      this.service.login({"username": username, "password": password}).then(response => {
        this.router.navigate(navigationDetails);
        return response;
      }).catch(error => {
        this.loginIncorrect = true;
        console.log("login error: " + error);
      });
    }
    console.log("Form submitted", login);
  }

}
