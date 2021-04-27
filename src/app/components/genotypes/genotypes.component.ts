import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Genotype, Sample } from '../../interfaces/interfaces';

@Component({
  selector: 'app-genotypes',
  templateUrl: './genotypes.component.html',
  styleUrls: ['./genotypes.component.css']
})
export class GenotypesComponent implements OnInit {
  @Input() homozygous: Genotype[];
  @Input() wildtype: Genotype[];
  @Input() heterozygous: Genotype[];
  @Output() closeDetails = new EventEmitter;
  noDetails: boolean = false;

  selected: Genotype[] = [];
  genotypes: {
    title: string;
    data: Genotype[];
  }[];

  active: string[] = [];

  actual: any;

  page = 1;
  pageSize = 6;

  constructor() {
  }

  ngOnInit(): void {
    this.updateVar();
  }

  ngOnChanges() {
    this.updateVar()
  }

  /*
  Method that updates what's inside the table each time a change in view occurs
  */
  updateVar(){
    this.genotypes = [
    { 
      title: "Wildtype", 
      data: this.wildtype,
    },
    {
      title: "Homozygous", 
      data: this.homozygous,
    },
    {
      title: "Heterozygous", 
      data: this.heterozygous,
    },
    {
      title: "All",
      data: [].concat(this.homozygous, this.wildtype, this.heterozygous),
    }
    ];
    this.noDetails = true;
    if (this.selected.length != 0) {
      this.getGenes();
    }    
  }

  /*
  Pagination for the small table
  */
  refresh(){
    this.actual = this.selected
    .map((element) => (element))
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  closeTag() {
    this.noDetails = true;
    this.closeDetails.emit(this.noDetails);
    this.selected = null;
    this.selected = null;
    this.active = null;
  }

  /*
  Method called each time a type of gene is selected
  */
  geneSelected(event: string){
    if (this.active.includes("All")) {
      this.active = [];
    }
    if (this.active.includes(event)) {
      this.active = this.active.filter(function(value, index, arr){
        return value != event;
      });
    }else{
      this.active.push(event);
    }
    if (this.active.length == 3 || event === "All") {
      this.active.length = 0;
      this.active.push("All");
    }
    this.getGenes();
  }

  /*
  Method that updates the content of the table
  */
  getGenes(){
    this.selected = [];
    this.genotypes.forEach(element => {
      if (this.active.includes(element.title)) {
        this.selected = [].concat(this.selected, element.data);
        console.log(this.selected);
        return;
      }
    });
    this.refresh();
  }

}
