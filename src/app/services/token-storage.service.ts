import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})

/**
 * La clase TokenStorageService permite controlar los token
 * de autenticación.
 */
export class TokenStorageService {

  constructor() { }

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

  /**
   * Borra el usuario anterior y guarda el actual
   * @param user objeto con las propiedades username y password
   */
  public saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Devuelve el usuario actual parseando el objeto
   * @returns el usuario actual
   */
  public getUser() {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }
}
