import { Component, OnInit } from '@angular/core';

import {PasswordModule} from 'primeng/password';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
