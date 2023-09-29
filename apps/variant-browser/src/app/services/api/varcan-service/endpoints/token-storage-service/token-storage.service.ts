import { Injectable } from '@angular/core';
import { AxiosInstance } from 'axios';
import { Token } from "../../models/response/Token";

const TOKEN_TYPE: string = 'token_type'
const REFRESH_TOKEN: string = 'refresh_token';
const ACCESS_TOKEN: string = 'access_token';
const EXPIRES_IN: string = 'expires_in';

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
    localStorage.clear();
  }

  /**
   * Borra el token anterior y guarda el nuevo pasado por parámetro
   * @param httpHandler instancia del cliente HTTP Axios
   * @param token token que se consigue al hacer login
   */
  saveToken(httpHandler: AxiosInstance, token: Token) {
    sessionStorage.setItem(REFRESH_TOKEN, token.refresh_token);
    sessionStorage.setItem(ACCESS_TOKEN, token.access_token);
    sessionStorage.setItem(TOKEN_TYPE, token.token_type);
    sessionStorage.setItem(EXPIRES_IN, token.expires_in.toString());
    httpHandler.defaults.headers.Authorization = `${token.token_type} ${token.refresh_token}`;
  }

  /**
   * Devuelve el token que se está usando
   * @returns token usado actualmente
   */
  getToken(): Token {
    return {
      token_type: sessionStorage.getItem(TOKEN_TYPE),
      refresh_token: sessionStorage.getItem(REFRESH_TOKEN) == 'null' ? null : sessionStorage.getItem(REFRESH_TOKEN),
      access_token: sessionStorage.getItem(ACCESS_TOKEN) == 'null' ? null : sessionStorage.getItem(ACCESS_TOKEN),
      expires_in: parseInt(sessionStorage.getItem(EXPIRES_IN))
    };
  }
}
