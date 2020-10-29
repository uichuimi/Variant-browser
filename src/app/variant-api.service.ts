import { Injectable } from '@angular/core';
import axios from "axios";


@Injectable({
  providedIn: 'root'
})
export class VariantApiService {
  gmaf: any = {gmaf: 0};
  modifiedResponse: any;
  constructor() { }

  getApiData() {
    let url = 'https://193.145.155.148:8443/variants?Page%20number=1&Results%20per%20page=100';
    //let url = 'http://localhost:3000/data';
    return axios.get(url)
      .then (response => {
        this.modifiedResponse = response.data.map(each => {
          return {
            ...each,
            ...this.gmaf
            }
        })
        return this.modifiedResponse;
      })
      .catch (error => {
        console.log("Se ha producido el error" ,error);
      })
  }
}

/* <-- Añadir campos a los datos -->
 this.modifiedResponse = response.data.map(each => {
          return {
            ...each,
            ...this.gmaf
            }
        })
        return this.modifiedResponse;

<-- Crear la variable -->
 gmaf: any = {gmaf: 0};
*/ 