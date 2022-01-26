import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';

/**
 * Hace que la clase se pueda usar como componente
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

/**
 * Esta clase se encarga de registrar a un usuario
 * implementa el lifecycle hook OnInit
 */
export class RegisterComponent implements OnInit {
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  /**
   * Crea un objeto tipo AuthService
   * @param authService clase que gestiona el login y el registro de usuarios
   */
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  /**
   * Método que hace la llamada al endpoint /signup
   * Se ejecuta al pulsar el botón del formulario
   * de register.component.html
   */
  onSubmit() {
    this.authService.register(this.form).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
