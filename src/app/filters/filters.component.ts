import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  chromosomes: SelectItem[];
  siftOptions: SelectItem[];
  polyphenOptions: SelectItem[];
  biotypes: SelectItem[];
  effects: SelectItem[];
  search: any = "";
  value: number;
  selectedSift: any;
  selectedEffect: any;
  selectedBiotype: any;
  selectedPolyphen: any;
  selectedChromosome: any;
  

  constructor() { 
    this.chromosomes= [
      {label: 'Chromosome', value: 'null'},
      {label: '1', value: '1'},
      {label: '2', value: '2'},
      {label: '3', value: '3'},
      {label: '4', value: '4'},
      {label: '5', value: '5'},
      {label: '6', value: '6'},
      {label: '7', value: '7'},
      {label: '8', value: '8'},
      {label: '9', value: '9'},
      {label: '10', value: '10'},
      {label: '11', value: '11'},
      {label: '12', value: '12'},
      {label: '13', value: '13'},
      {label: '14', value: '14'},
      {label: '15', value: '15'},
      {label: '16', value: '16'},
      {label: '17', value: '17'},
      {label: '18', value: '18'},
      {label: '19', value: '19'},
      {label: '20', value: '20'},
      {label: '21', value: '21'},
      {label: '22', value: '22'},
      {label: '23', value: '23'},
      {label: 'X', value: 'X'},
      {label: 'Y', value: 'Y'},
  ];
    this.siftOptions= [
      {label: 'Sift', value: 'null'},
      {label: 'tolerated', value: '1'},
      {label: 'deleterious', value: '0'}
    ];

    this.polyphenOptions= [
      {label: 'Polyphen', value: 'null'},
      {label: 'benign', value: '1'},
      {label: 'probably_damaging', value: '0.8'},
      {label: 'unknown', value: '0.5'},
      {label: 'possibly_damaging', value: '0'}
    ];

    this.biotypes= [
      {label: 'Biotype', value: 'null'},
      {label: 'protein_coding', value: '1'},
      {label: 'processed_pseudogene', value: '2'},
      {label: 'lincRNA', value: '3'},
      {label: 'antisense', value: '4'},
      {label: 'unprocessed_pseudogene', value: '5'},
      {label: 'misc_RNA', value: '6'},
      {label: 'snRNA', value: '7'},
      {label: 'miRNA', value: '8'},
      {label: 'TEC', value: '9'},
      {label: 'snoRNA', value: '10'},
      {label: 'sense_intronic', value: '11'},
      {label: 'transcribed_unprocessed_pseudogene', value: '12'},
      {label: 'processed_transcript', value: '13'},
      {label: 'rRNA_pseudogene', value: '14'},
      {label: 'transcribed_processed_pseudogene', value: '15'},
      {label: 'IG_V_pseudogene', value: '16'},
      {label: 'sense_overlapping', value: '17'},
      {label: 'IG_V_gene', value: '18'},
      {label: 'transcribed_unitary_pseudogene', value: '19'},
      {label: 'TR_V_gene', value: '20'},
      {label: 'unitary_pseudogene', value: '21'},
      {label: 'TR_J_gene', value: '22'},
      {label: 'bidirectional_promoter_lncRNA', value: '23'},
      {label: 'rRNA', value: '24'},
      {label: 'scaRNA', value: '25'},
      {label: 'polymorphic_pseudogene', value: '26'},
      {label: 'IG_D_gene', value: '27'},
      {label: 'TR_V_pseudogene', value: '28'},
      {label: '3prime_overlapping_ncRNA', value: '29'},
      {label: 'pseudogene', value: '30'},
      {label: 'Mt_tRNA', value: '31'},
      {label: 'IG_J_gene', value: '32'},
      {label: 'IG_C_gene', value: '33'},
      {label: 'IG_C_pseudogene', value: '34'},
      {label: 'ribozyme', value: '35'},
      {label: 'TR_C_gene', value: '36'},
      {label: 'sRNA', value: '37'},
      {label: 'TR_D_gene', value: '38'},
      {label: 'TR_J_pseudogene', value: '39'},
      {label: 'IG_J_pseudogene', value: '40'},
      {label: 'non_coding', value: '41'},
      {label: 'Mt_rRNA', value: '42'},
      {label: 'translated_processed_pseudogene', value: '43'},
      {label: 'macro_lncRNA', value: '44'},
      {label: 'IG_pseudogene', value: '45'},
      {label: 'scRNA', value: '46'},
      {label: 'vaultRNA', value: '47'},
    ];

    this.effects= [
      {label: 'Effects', value: 'null'},
      {label: 'intron variant', value: '1'},
      {label: 'intergenic variant', value: '2'},
      {label: 'upstream gene variant', value: '3'},
      {label: 'downstream gene variant', value: '4'},
      {label: '3 prime UTR variant', value: '5'},
      {label: 'non coding transcript exon variant', value: '6'},
      {label: 'missense variant', value: '7'},
      {label: 'synonymous variant', value: '8'},
      {label: '5 prime UTR variant', value: '9'},
      {label: 'splice region variant', value: '10'},
      {label: 'frameshift variant', value: '11'},
      {label: '5 prime UTR premature start codon gain variant', value: '12'},
      {label: 'stop gained', value: '13'},
      {label: 'disruptive inframe deletion', value: '14'},
      {label: 'splice donor variant', value: '15'},
      {label: 'splice acceptor variant', value: '16'},
      {label: 'disruptive inframe insertion', value: '17'},
      {label: 'conservative inframe insertion', value: '18'},
      {label: 'conservative inframe deletion', value: '19'},
      {label: 'start lost', value: '20'},
      {label: 'stop lost', value: '21'},
      {label: 'stop retained variant', value: '22'},
      {label: 'inframe deletion', value: '23'},
      {label: 'intragenic variant', value: '24'},
      {label: 'bidirectional gene fusion', value: '25'},
      {label: 'inframe insertion', value: '26'},
      {label: 'gene fusion', value: '27'},
      {label: 'mature miRNA variant', value: '28'},
      {label: 'transcript ablation', value: '29'},
      {label: 'protein altering variant', value: '30'}
    ];
  }

  ngOnInit(): void {
  }

  onFocus(){
      this.value = null;
  }
}
