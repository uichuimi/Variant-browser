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
  constructor() { }

  getApiData(page, size, chromosome, posMin, posMax, gene, sift, polyphen, biotype, term, gmaf) {
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
        biotype: biotype,
        terms: term,
        maxAlleleFrequency: gmaf
      }
    })
    .then(response =>{
      console.log(response);
      console.log(response.data.content);
      this.variantsTrial = this.variantsTrial.concat(this.adjustingData(response.data.content));
      console.log(this.variantsTrial);
      this.incomeInfo.edited = this.variantSizeCalculator();
      console.log(this.variantsTrial.length);
      this.incomeInfo.data = this.variantsTrial;
      this.incomeInfo.elements = response.data.totalElements;
      this.incomeInfo.empty = response.data.empty;
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
      each.frequencies.forEach(frequencie => {
        switch (frequencie.source) {
          case 'gnomAD_genomes':
            frequencie.source = "GG";
            break;
          case 'gnomAD_exomes':
            frequencie.source = "GE";
            break;
          case 'ExAC':
            frequencie.source = "EX";
            break;
          case '1000_genomes':
            frequencie.source = "1KG";
            break;
        }
      });
      switch (each.polyphen) {
        case 'probably_damaging':
          each.polyphen = "probably damaging";
          break;
        case 'possibly_damaging':
          each.polyphen = "possibly damaging";
          break;
      }
    });
    return value;
  }

  variantSizeCalculator(){
    if (this.variantsTrial.length >= 400) {
      this.variantsTrial = this.variantsTrial.slice(99, 399);
      return true;
    }else{
      return false;
    }
  }
}

