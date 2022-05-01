import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

// CONSTANT
import { GlobalConstants } from 'src/app/common/global-constants';

// SERVICES
import { VarCanService } from 'src/app/services/varcan-service/var-can.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('passwordError', [
      state('closed', style({
        opacity: 0,
        transform: "translateX(-10px)"
      })),
      state('open', style({
        opacity: 1,
        transform: "translateX(0)"
      })),
      transition('* => *', animate(300))
    ]),
    trigger('inputError', [
      transition(
        ':enter', 
        [
          style({ height: 0, opacity: 0 }),
          animate('1s ease-out', style({ transform: "translateY(0)", opacity: 1 }))
        ]
      ),
      transition(
        ':leave', 
        [
          style({ height: 300, opacity: 1 }),
          animate('1s ease-in', style({ transform: "translateY(-10px)", opacity: 0 }))
        ]
      )      
    ])
  ]  
})
export class LoginComponent implements OnInit {
  private service: VarCanService;
  loginIncorrect = false;
  loading = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.service = GlobalConstants.getService();
  }

  onClick() {
    console.log("sdfdasfa");
    this.loginIncorrect = false;
  }

  submit(login) {
    this.loginIncorrect = false;

    if(!login.invalid) {
      console.log("valid");
      this.login(login);
    }
    console.log("Form submitted", login);
  }

  login(login) {
    const navigationDetails: string[] = ['/variants'];
    const { username, password } = login.form.value;

    this.service.login({"username": username, "password": password}).then(response => {
      this.setLocalStorage();
      sessionStorage.setItem('username', username);

      this.router.navigate(navigationDetails);
      return response;
    }).catch(error => {
      this.loginIncorrect = true;
      console.log("login error: " + error);
    });
  }

  setLocalStorage(): void {
    GlobalConstants.setChromosomes();
    GlobalConstants.setEffects();
  }
}
