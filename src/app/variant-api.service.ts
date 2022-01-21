import { Injectable } from '@angular/core';
import axios from "axios";
import {environment} from '../environments/environment';
import {TokenStorageService} from './services/token-storage.service';

const API_URL = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})

/**
 * La clase VariantApiService se encarga de hacer las llamadas
 * a la base de datos 'varcan'
 */ 
export class VariantApiService {
  showAltValue: any = { showAlt: false };
  showRefValue: any = { showRef: false };
  modifiedResponse: any = [];
  incomeInfo: any = { data: [], elements: 0, empty: true };

  /**
   * Crea un objeto de tipo TokenStorageService que se usará para crear
   * que se usará en el método 'getRequestHeader()'
   * @param token string que permite obtener datos de la base de datos
   */ 
  constructor(private token: TokenStorageService) { }

  /**
   * Crea un objeto que hará de cabecera en las llamadas, en él se 
   * indica el token que permitirá acceder a los datos de 'varcan'
   * @returns objeto 'headers'  
   */ 
  private getRequestHeader() {
    const token = this.token.getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  /**
   * Obtiene las variantes que se ajusten a los parámetros pasados
   * @param page 
   * @param size 
   * @param chromosome 
   * @param posMin 
   * @param posMax 
   * @param gene 
   * @param sift 
   * @param polyphen 
   * @param biotype 
   * @param term 
   * @param gmaf 
   * @returns si la llamada va bien
   */ 
  getApiData(page, size, chromosome, posMin, posMax, gene, sift, polyphen, biotype, term, gmaf) {
    let url = API_URL + '/variants?pageNumber=' + page + '&pageSize=' + size;
    if (chromosome != undefined) {
      url += '&chrom=' + chromosome;
    }
    if (posMin != undefined && posMin != null) {
      url += '&start=' + posMin;
    }
    if (posMax != undefined && posMax != null) {
      url += '&end=' + posMax;
    }
    if (gene != undefined && gene != "") {
      url += '&genes=' + gene;
    }
    if (sift != undefined) {
      url += '&sift=' + sift;
    }
    if (polyphen != undefined) {
      url += '&polyphen=' + polyphen;
    }
    if (biotype != undefined) {
      url += '&biotypes=' + biotype;
    }
    if (term != undefined) {
      url += '&terms=' + term;
    }
    if (gmaf != undefined && gmaf != null) {
      url += '&maxAlleleFrequency=' + gmaf;
    }
    console.log(url);
    return axios.get(url, this.getRequestHeader())
      .then(response => {
        this.modifiedResponse = response.data.content.map(each => {
          return {
            ...each,
            ...this.showAltValue,
            ...this.showRefValue
          }

        })
        this.incomeInfo.data = this.modifiedResponse;
        this.incomeInfo.elements = response.data.totalElements;
        this.incomeInfo.empty = response.data.empty;
        return this.incomeInfo;
      })
      .catch(error => {
        console.log("Se ha producido el error", error);
      });
  }

  /**
   * Obtiene los genes que se ajusten al parámetro 'search'
   * @param search 
   * @returns objeto que contiene los genes
   */  
  getGenesData(search) {
    let url = API_URL + '/genes?search=' + search;
    return axios.get(url, this.getRequestHeader())
      .then(response => {
        return response.data;
      })

      .catch(error => {
        console.log("Se ha producido el error", error);
      })
  }

  getTermsData() {
    let url = environment.serverUrl + '/terms';
    return axios.get(url, this.getRequestHeader())
      .then(response => {
        return response.data;
      })

      .catch(error => {
        console.log("Se ha producido el error", error);
      })
  }

  getBiotypeData() {
    let url = API_URL + '/biotypes';
    return axios.get(url, this.getRequestHeader())
      .then(response => {
        return response.data;
      })

      .catch(error => {
        console.log("Se ha producido el error", error);
      })
  }
}

