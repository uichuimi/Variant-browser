import {ConsequenceLine} from "../../models/consequence-line";
import {Transcript} from "../../../api/varcan-service/models/response/Transcript";

export class TranscriptLineDataSource {
  private readonly enst: string;
  private readonly dna_ncbi: string;
  private readonly rna_ncbi: string;
  private readonly start: string;
  private readonly end: string;

  constructor(transcript: Transcript) {
    if (transcript === null) {
      this.enst = "-";
      this.dna_ncbi = "-";
      this.rna_ncbi = "-";
      this.start = "-";
      this.end = "-";
    } else {
      this.enst = transcript.enst || "-";
      this.dna_ncbi = transcript.dna_ncbi || "-";
      this.rna_ncbi = transcript.rna_ncbi || "-";
      this.start = transcript.start || "-";
      this.end = transcript.end || "-";
    }
  }

  get line(): ConsequenceLine {
    return {
      enst: this.enst,
      dna_ncbi: this.dna_ncbi,
      rna_ncbi: this.rna_ncbi,
      start: this.start,
      end: this.end
    }
  }
}
