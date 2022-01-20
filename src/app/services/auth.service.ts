import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const AUTH_API = environment.serverUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

/**
 * La clase AuthService permite loguear
 * a un usuario y registrar a uno nuevo
 */
export class AuthService {

  /**
   * Crea un objeto de tipo HttpClient que permite hacer las request.
   * Se accede a este objeto en los métodos login y register.
   * @param http 
   */
  constructor(private http: HttpClient) { }

  /**
   * Este método hace un request para loguear a un usuario
   * @param credentials objeto con dos propiedades (username y password)
   * @returns un observable que se usará para ejecutar el POST request
   */
  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + '/login', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  /**
   * Este método hace un request para registrar a un usuario
   * @param user objeto con dos propiedades (username y password)
   * @returns un observable que se usará para ejecutar el POST request
   */
  register(user): Observable<any> {
    return this.http.post(AUTH_API + '/signup', {
      username: user.username,
      password: user.password
    }, httpOptions);
  }
}
