import { Injectable } from '@angular/core';
import axios from "axios";


@Injectable({
  providedIn: 'root'
})
export class VariantApiService {
  showAltValue: any = {showAlt: false};
  showRefValue: any = {showRef: false};
  modifiedResponse: any;
  incomeInfo: any = {data: [], pages: 0};

  constructor() { }

  getApiData(page, effect?, search?) {
    let url = 'http://193.145.155.148:9090/variants?end=100000&pageNumber=1&pageSize=60&start=10000&maxAlleleFrequency=0.1&sift=deleterious';
    /*url += '&pageNumber=' + page + '&pageSize=60';
    url += '&genes=APOB&'/*
    /*if (effect != undefined){
      url += '?terms=' + effect;
      console.log("Entro en los efectos");
    }
    if (search != undefined){
      url += '?genes=' + search;
      console.log("Etro en los genes");
    } */
    
    console.log(url);
    return axios.get(url)
      .then (response => {
        this.modifiedResponse = response.data.content.map(each => {
          return {
            ...each,
            ...this.showAltValue,
            ...this.showRefValue
            }
            
        })
        this.incomeInfo.data= this.modifiedResponse; 
        this.incomeInfo.pages = response.data.totalPages;
        return this.incomeInfo;
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