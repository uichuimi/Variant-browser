import { Injectable } from '@angular/core';
import axios from 'axios';

import { environment } from '../../environments/environment';

import { Variant } from '../interfaces/interfaces';

const serviceURL = environment.mainURL;

// Service which creates all the query request to the restAPI

@Injectable({
  providedIn: 'root'
})
export class VariantApiService {
  showAltValue: any = { showAlt: false };
  showRefValue: any = { showRef: false };
  modifiedResponse: any = [];
  incomeInfo: any = { data: [], elements: 0, empty: true, edited: false };

  variantsTrial: Variant[] = [];
  cachePage = 0;

  constructor() { }

  getApiData(page, size, chromosome, posMin, posMax, gene, sift, polyphen, biotype, impact, gmaf, effect) {
    var Qs = require('qs');
    return axios.get(serviceURL + 'variants', {
      params:{
        page: page,
        size: size,
        chrom: chromosome,
        start: posMin,
        end: posMax,
        gene: gene,
        sift: sift,
        polyphen: polyphen,
        biotype: biotype,
        impact: impact,
        //effect: effect,
        max_af: gmaf
      }, paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'}) //Format for the query
      }
    })
    .then(response =>{
      console.log(response);
      console.log(response.data.content);
      if (this.cachePage <= page) {
        this.variantsTrial = this.variantsTrial.concat(this.adjustingData(response.data.content));
        this.incomeInfo.edited = this.variantSizeCalculator(page);
      }else{
        this.variantsTrial = this.adjustingData(response.data.content).concat(this.variantsTrial);
        this.incomeInfo.edited = true;
        this.variantSizeCalculator(page);
      }
      console.log(this.variantsTrial);
      this.incomeInfo.data = this.variantsTrial;
      this.incomeInfo.elements = response.data.totalElements;
      this.incomeInfo.totalPages = response.data.totalPages;
      this.incomeInfo.empty = response.data.empty;
      this.cachePage = page;
      return this.incomeInfo;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getFilterData(query: string){
    let url = serviceURL + query;
    return axios.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getChromsData() {
    let url = serviceURL + '/chroms';
    return axios.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getEffectsData(search) {
    let url = serviceURL + '/effects?search=' + search;
    return axios.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getImpactsData() {
    let url = serviceURL + '/impacts';
    return axios.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getPolyphenData() {
    let url = serviceURL + '/polyphen';
    return axios.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getSiftData() {
    let url = serviceURL + '/sift';
    return axios.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getSamplesData() {
    let url = serviceURL + '/samples';
    return axios.get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  ///////////////////////////////////////////////////// BASICOS ^

  getGenesData(search) {
    let url = serviceURL + '/v2/genes?search=' + search;
    return axios.get(url)
    .then(response => {
      return response.data.content;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getBiotypeData() {
    let url = serviceURL + '/biotypes';
    return axios.get(url)
    .then(response => {
      return response.data;
    })

    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  adjustingData(value) {

    value.forEach(each => {
      each.pos = new Intl.NumberFormat("en-GB").format(each.pos);
      if (each.polyphen >= 0.85) {
        each.polyphen = "probably damaging";
      }else if (each.polyphen >= 0.15) {
        each.polyphen = "possibly damaging";
      }else{
        each.polyphen = null;
      }
      if (each.sift != null) {
        if (each.sift <= 0.1) {
          each.sift = "deleterious"
        }else{
          each.sift = "tolerated"
        }
      }
    });
    return value;
  }

  //The variants are edited in order to keep the amount of local data managable
  variantSizeCalculator(page){
    if (this.variantsTrial.length >= 400) {
      if (this.cachePage < page) {
        this.variantsTrial = this.variantsTrial.slice(100, 400);
      }else{
        this.variantsTrial = this.variantsTrial.slice(0, 300);
      }
      return true;
    }else{
      return false;
    }
  }

  variantCleaner(){
    this.variantsTrial.length = 0;
  }
}

