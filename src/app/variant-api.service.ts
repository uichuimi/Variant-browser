import { Injectable } from '@angular/core';
import axios from "axios";


@Injectable({
  providedIn: 'root'
})
export class VariantApiService {
  gmaf: any = {gmaf: 0};
  showAltValue: any = {showAlt: false};
  showRefValue: any = {showRef: false};
  modifiedResponse: any;
  constructor() { }

  getApiData(page, effect?, search?) {
    let url = 'http://193.145.155.148:9090/variants?';
    url += 'page=' + page + '&pageSize=60';
    if (effect != undefined){
      url += 'terms=' + effect;
      console.log("No se porque entro");
    }
    if (search != undefined){
      url += 'genes=' + search;
      console.log("Que mal todo");
    }
    console.log(url);
    return axios.get(url)
      .then (response => {
        this.modifiedResponse = response.data.map(each => {
          return {
            ...each,
            ...this.gmaf,
            ...this.showAltValue,
            ...this.showRefValue
            }
        })
        return this.modifiedResponse;
      })
      .catch (error => {
        console.log("Se ha producido el error" ,error);
      })
  }

 /* getApiFilteredData(effect){
    let url = 'http://193.145.155.148:9090/variants?';
    if (effect != undefined){
      url += 'terms=' + effect;
    }
    return axios.get(url)
      .then (response => {
        this.modifiedResponse = response.data.map(each => {
          return {
            ...each,
            ...this.gmaf,
            ...this.showAltValue,
            ...this.showRefValue
            }
        })
        return this.modifiedResponse;
      })
      .catch (error => {
        console.log("Se ha producido el error" ,error);
      })
  }*/

  getSearchData(search){
    let url= 'http://193.145.155.148:9090/genes?search=' + search;
    return axios.get(url)
      .then (response => {
          return response.data;
        })

      .catch (error => {
        console.log("Se ha producido el error" ,error);
      })
  }

  getTermsData(){
    let url= 'http://193.145.155.148:9090/terms';
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
            ...this.gmaf
            }
        })
        return this.modifiedResponse;

<-- Crear la variable -->
 gmaf: any = {gmaf: 0};
*/ 