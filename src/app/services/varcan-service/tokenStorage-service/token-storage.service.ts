import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})

/**
 * La clase TokenStorageService permite controlar los token
 * de autenticación.
 */
export class TokenStorageService {

  constructor() {}

  /**
   * Limpia todos los datos guardados en sessionStorage, 
   * incluyendo el token y su valor, por lo que se cierra sesión
   */
  signout() {
    window.sessionStorage.clear();
  }

  /**
   * Borra el token anterior y guarda el nuevo pasado por parámetro
   * @param token token que se consigue al hacer login
   */
  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Devuelve el token que se está usando
   * @returns token usado actualmente
   */
  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }
}
