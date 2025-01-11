import {Consequence} from "../../../api/varcan-service/models/response/Consequence";
import {Gene} from "../../../api/varcan-service/models/response/Gene";
import {Biotype} from "../../../api/varcan-service/models/response/Biotype";
import {Impact} from "../../../api/varcan-service/models/response/Impact";
import {Effect} from "../../../api/varcan-service/models/response/Effect";
import {GeneLineDataSource} from "./gene-line-data-source";
import {BiotypeLineDataSource} from "./biotype-line-data-source";
import {EffectLineDataSource} from "./effect-line-data-source";
import {ImpactLineDataSource} from "./impact-line-data-source";
import {TranscriptLineDataSource} from "./transcript-line-data-source";
import {ConsequenceLine} from "../../models/consequence-line";
import {Transcript} from "../../../api/varcan-service/models/response/Transcript";

export class ConsequenceLineDataSource {
  private geneLine: GeneLineDataSource = new GeneLineDataSource(null);
  private biotypeLine: BiotypeLineDataSource = new BiotypeLineDataSource(null);
  private impactLine: ImpactLineDataSource = new ImpactLineDataSource(null);
  private effectLine: EffectLineDataSource = new EffectLineDataSource(null);
  private transcriptLine: TranscriptLineDataSource = new TranscriptLineDataSource(null);
  private sift: string;
  private hgvsp: string;
  private hgvsc: string;
  private polyphen: string;

  constructor(consequence: Consequence, geneCache: Array<Gene>, biotypeCache: Array<Biotype>,
              impactCache: Array<Impact>, effectCache: Array<Effect>) {
    console.log("Consequence", consequence);
    this.getTranscriptLineById(consequence.transcript);
    this.getGeneLineById(consequence.transcript, geneCache, biotypeCache);
    this.getEffectLineById(consequence.effect.id, effectCache);
    this.getImpactLineById(consequence.impact.id, impactCache);
    this.sift = `${consequence.sift || "-"}`;
    this.hgvsp = consequence.hgvsp || "-";
    this.hgvsc = consequence.hgvsc || "-";
    this.polyphen = `${consequence.polyphen || "-"}`;
  }

  private getTranscriptLineById(transcript: Transcript) {
    this.transcriptLine = new TranscriptLineDataSource(transcript);
  }

  private getGeneLineById(transcript: Transcript, geneCache: Array<Gene>, biotypeCache: Array<Biotype>) {
    if (transcript === null || transcript.gene === null) return;

    const gene: Gene = geneCache.find((gene: Gene) => transcript.gene.id === gene.id);

    if (gene !== null && gene.biotype !== null) {
      this.biotypeLine = this.getBiotypeLineById(transcript, biotypeCache);
    }

    this.geneLine = new GeneLineDataSource(gene);
  }

  private getEffectLineById(effectId: number, effectCache: Array<Effect>) {
    if (effectId === null) return;
    const effect: Effect = effectCache.find((effect: Effect) => effect.id === effectId);
    this.effectLine = new EffectLineDataSource(effect);
  }

  private getImpactLineById(impactId: number, impactCache: Array<Impact>) {
    if (impactId === null) return;
    const impact: Impact = impactCache.find((impact: Impact) => impact.id === impactId);
    this.impactLine = new ImpactLineDataSource(impact);
  }

  private getBiotypeLineById(transcript: Transcript, biotypeCache: Array<Biotype>) {
    if (transcript === null || transcript.gene === null || transcript.gene.biotype === null) return;
    const biotype: Biotype = biotypeCache.find((biotype: Biotype) => biotype.id === transcript.gene.biotype.id);
    return new BiotypeLineDataSource(biotype);
  }

  get line(): ConsequenceLine {
    console.log(this.transcriptLine)
    console.log(this.transcriptLine.line)
    return {
      ...this.geneLine.line,
      ...this.biotypeLine.line,
      ...this.effectLine.line,
      ...this.impactLine.line,
      ...this.transcriptLine.line,
      sift: this.sift,
      hgvsp: this.hgvsp,
      hgvsc: this.hgvsc,
      polyphen: this.polyphen,
    }
  }
}
