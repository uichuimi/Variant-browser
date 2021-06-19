import { Injectable } from '@angular/core';
import axios from 'axios';
import fileDownload from 'js-file-download';

import { HttpParams } from '@angular/common/http';

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

  //Function to access the VariantController in the API
  getApiData(page, size, chromosome, posMin, posMax, gene, sift, polyphen, biotype, impact, gmaf, effect, mode, cases, controls) {
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
        biotypes: biotype,
        impact: impact,
        effect: undefined,
        mode: mode,
        cases: cases,
        controls: controls,
        max_af: gmaf
      }, paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'}) //Format for the query
      }
    })
    .then(response =>{
      console.log(response);
      console.log(response.data.content);
      if (this.cachePage <= page) {
        //In order to keep a sliding window we concat the existing data with the new one
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

  //Retrieves all the values for the filters by apending to the base URL the filter endpoint
  //before the query
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

  getGenesData(search) {
    let url = serviceURL + '/genes?search=' + search;
    return axios.get(url)
    .then(response => {
      return response.data.content;
    })
    .catch(error => {
      console.log("Se ha producido el error", error);
    })
  }


  //Adjust the values of the obtained data from the API to be more user friendly
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
      each.frequencies.forEach(freq => {
        freq.af = Math.round((freq.af + Number.EPSILON) * 10000) / 10000;
      });
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

  variantDownload(page, size, chromosome, posMin, posMax, gene, sift, polyphen, biotype, impact, gmaf, effect, mode, cases, controls){
    let params = [
      {name: "page", value: page},
      {name: "size", value: size},
      {name: "chrom", value: chromosome},
      {name: "start", value: posMin},
      {name: "end", value: posMax},
      {name: "gene", value: gene},
      {name: "sift", value: sift},
      {name: "polyphen", value: polyphen},
      {name: "biotype", value: biotype},
      {name: "impact", value: impact},
      {name: "effect", value: undefined},
      {name: "mode", value: mode},
      {name: "cases", value: cases},
      {name: "controls", value: controls},
      {name: "max_af", value: gmaf},
    ];
    let httpParams = new HttpParams();
    params.forEach(obj => {
      if (obj.value != undefined) {
        httpParams = httpParams.append(obj.name, obj.value);
      }
    });
    window.open(serviceURL + "download/variants?" + httpParams.toString(), "_self")
  }
}

