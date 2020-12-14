import { Injectable } from '@angular/core';
import axios from "axios";


@Injectable({
  providedIn: 'root'
})
export class VariantApiService {
  showAltValue: any = {showAlt: false};
  showRefValue: any = {showRef: false};
  modifiedResponse: any;
  incomeInfo: any = {data: [], elements: 0};

  constructor() { }

  getApiData(page, size, chromosome, posMin, posMax, gene, sift, polyphen, biotype, term, gmaf) {
    let url = 'http://193.145.155.148:9090/variants?pageNumber=' + page + '&pageSize=' + size;
    if(chromosome != undefined){
      url += '&chrom=' + chromosome;
    }
    if(posMin != undefined){
      url += '&start=' + posMin;
    }
    if(posMax != undefined){
      url += '&end=' + posMax;
    }
    if(gene != undefined){
      url += '&genes=' + gene;
    }
    if(sift != undefined){
      url += '&sift=' + sift;
    }
    if(polyphen != undefined){
      url += '&polyphen=' + polyphen;
    }
    if(biotype != undefined){
      url += '&biotypes=' + biotype;
    }
    if(term != undefined){
      url += '&terms=' + term;
    }
    if(gmaf != undefined){
      url += '&maxAlleleFrequency=' + gmaf;
    }
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
        this.incomeInfo.elements = response.data.totalElements;
        return this.incomeInfo;
      })
      .catch (error => {
        console.log("Se ha producido el error" ,error);
      })
  }

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

  getBiotypeData(){
    let url= 'http://193.145.155.148:9090/biotypes';
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