import { Injectable } from '@angular/core';
import axios from "axios";


@Injectable({
  providedIn: 'root'
})
export class VariantApiService {
  isSelected: any = { isSelected : 0};
  modifiedResponse : any = [];
  constructor() { }

  getApiData() {
    let url = 'http://localhost:3000/data';
    return axios.get(url)
      .then (response => {
        this.modifiedResponse = response.data.map(each => {
          return {
            ...each,
            ...this.isSelected
            }
        })
        return this.modifiedResponse;
      })
      .catch (error => {
        console.log("Se ha producido el error" ,error);
      })
  }
}
