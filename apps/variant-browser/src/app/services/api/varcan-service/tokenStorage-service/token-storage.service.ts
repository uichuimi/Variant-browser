import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';
import { Token } from "../../../../models/output/Token";

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
   * @param httpHandler instancia del cliente HTTP Axios
   * @param token token que se consigue al hacer login
   */
  public saveToken(httpHandler: AxiosInstance, token: Token) {
    httpHandler.defaults.headers.Authorization = `${token.token_type} ${token.refresh_token}`;
  }

  /**
   * Devuelve el token que se está usando
   * @returns token usado actualmente
   */
  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }
}
