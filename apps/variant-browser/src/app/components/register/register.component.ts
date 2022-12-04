import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
export class RegisterComponent {

  constructor(private router: Router) { }

  submit(register) {
    const navigationDetails: string[] = ['/login'];

    if (!register.invalid) {
      console.log('valid');
      const { firstName, lastName, email, username, password, confirmPassword } = register.form.value;
      // this.router.navigate(navigationDetails);
    }
    console.log('Form submitted: ', register);
  }

}
