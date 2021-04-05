import { Injectable } from '@angular/core';
import axios from "axios";

import { environment } from '../../environments/environment';

import { Variant } from '../interfaces/interfaces';

const serviceURL = environment.mainURL;

//Service which creates all the query request to the restAPI

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

  getApiData(page, size, chromosome, posMin, posMax, gene, sift, polyphen, biotype, term, gmaf) {
    var Qs = require('qs');
    return axios.get(serviceURL + '/variants', {
      params:{
        pageNumber: page,
        pageSize: size,
        chrom: chromosome,
        start: posMin,
        end: posMax,
        genes: gene,
        sift: sift,
        polyphen: polyphen,
        biotypes: biotype,
        terms: term,
        maxAlleleFrequency: gmaf
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

  getGenesData(search) {
    let url = serviceURL + '/genes?search=' + search;
    return axios.get(url)
    .then(response => {
      return response.data;
    })

    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }

  getTermsData() {
    let url = serviceURL + '/terms';
    return axios.get(url)
    .then(response => {
      return response.data;
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
      switch (each.polyphen) {
        case (each.polyphen <= 0.7):
        each.polyphen = "possibly damaging";
        break;
        default:
        each.polyphen = "probably damaging";
        break;
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

