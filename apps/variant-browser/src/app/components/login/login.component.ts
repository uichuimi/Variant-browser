import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {VarcanService} from '../../services/api/varcan-service/varcan.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('passwordError', [
      state('closed', style({
        opacity: 0,
        transform: 'translateX(-10px)'
      })),
      state('open', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('* => *', animate(300))
    ]),
    trigger('inputError', [
      transition(
        ':enter',
        [
          style({ height: 0, opacity: 0 }),
          animate('1s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
        ]
      ),
      transition(
        ':leave',
        [
          style({ height: 300, opacity: 1 }),
          animate('1s ease-in', style({ transform: 'translateY(-10px)', opacity: 0 }))
        ]
      )
    ])
  ]
})
export class LoginComponent  {
  loginIncorrect = false;
  loading = false;

  constructor(private service: VarcanService, private router: Router) { }

  onClick() {
    this.loginIncorrect = false;
  }

  async submit(login) {
    this.loginIncorrect = false;

    if (!login.invalid) {
      await this.performLogin(login);
    }
  }

  async performLogin(login) {
    const navigationDetails: string[] = ['/variants'];
    const { username, password } = login.form.value;

    this.service.login({username, password}).then(response => {
      this.router.navigate(['/variants']);
    }).catch(error => {
      this.loginIncorrect = true;
      console.log('login error: ' + error);
    });
  }
}
