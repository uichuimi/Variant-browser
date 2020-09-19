import { Injectable } from '@angular/core';
import axios from "axios";


@Injectable({
  providedIn: 'root'
})
export class VariantApiService {

  constructor() { }

  getApiData() {
    let url = 'http://localhost:3000/data';
    return axios.get(url)
      .then (response => {
        return response.data;
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
            ...this.isSelected
            }
        })
        return this.modifiedResponse;
*/ 