import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

const API_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})

/**
 * 
 */
export class UserService {

  /**
   * Crea un objeto de tipo HttpClient que permite hacer las request.
   * Se accede a este objeto en los métodos login y register.
   * @param http 
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los datos de un usuario
   * @returns un observable al que hay que suscribirse para hacer la llamada
   */
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + '/user', { responseType: 'text' });
  }
}
