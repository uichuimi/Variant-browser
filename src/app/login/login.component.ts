import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {TokenStorageService} from '../services/token-storage.service';

/**
 * Hace que la clase se pueda usar como componente de Angular.
 * 
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * Esta clase se encarga de loguear a un usuario
 * implementa el lifecycle hook OnInit
 */
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  /**
   * Crea dos objetos, uno tipo AuhtService y otro tipo TokenStorageService
   * @param authService clase que gestiona el login y el registro de usuarios
   * @param tokenStorage clase que gestiona los tokens
   */
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  /**
   * Este método se lanza automáticamente después
   * de inicializar todas las propiedades de la directiva
   */
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  /**
   * Método que hace la llamada al endpoint /login
   * Se ejecuta al pulsar el botón del formulario
   * de login.component.html
   */
  onSubmit() {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  /**
   * Este método recarga la página actual
   */
  reloadPage() {
    window.location.reload();
  }
}
