import { Consequence } from "../../../api/varcan-service/models/response/Consequence";
import { Gene } from "../../../api/varcan-service/models/response/Gene";
import { Biotype } from "../../../api/varcan-service/models/response/Biotype";
import { Impact } from "../../../api/varcan-service/models/response/Impact";
import { Effect } from "../../../api/varcan-service/models/response/Effect";
import { GeneLine } from "./gene-line";
import { BiotypeLine } from "./biotype-line";
import { EffectLine } from "./effect-line";
import { VariantLine } from "../../models/variant-line";
import { ImpactLine } from "./impact-line";

export class ConsequenceLine {
  private geneLine: GeneLine;
  private biotypeLine: BiotypeLine;
  private impactLine: ImpactLine;
  private effectLine: EffectLine;
  private transcript: string;
  private sift: string;
  private hgvsp: string;
  private hgvsc: string;
  private polyphen: string;

  constructor(consequence: Consequence, geneCache: Array<Gene>, biotypeCache: Array<Biotype>,
              impactCache: Array<Impact>, effectCache: Array<Effect>) {
    this.geneLine = this.getGeneLineById(consequence.gene, geneCache, biotypeCache);
    this.effectLine = this.getEffectLineById(consequence.effect, effectCache);
    this.impactLine = this.getImpactLineById(consequence.impact, impactCache);
    this.sift = `${consequence.sift || "-"}`;
    this.hgvsp = consequence.hgvsp || "-";
    this.hgvsc = consequence.hgvsc || "-";
    this.polyphen = `${consequence.polyphen || "-"}`;
    this.transcript = `${consequence.transcript || "-"}`;
  }


  private getGeneLineById(geneId: number, geneCache: Array<Gene>, biotypeCache: Array<Biotype>): GeneLine {
    const gene: Gene = geneCache
      .find((gene: Gene) => gene.id === geneId);

    if (gene.biotype) {
      this.biotypeLine = this.getBiotypeLineById(gene.biotype.id, biotypeCache);
    } else {
      this.biotypeLine = new BiotypeLine(null);
    }

    return new GeneLine(gene);
  }

  private getEffectLineById(effectId: number, effectCache: Array<Effect>): EffectLine {
    const effect: Effect = effectCache.find((effect: Effect) => effect.id === effectId);
    return new EffectLine(effect);
  }

  private getImpactLineById(impactId: number, impactCache: Array<Impact>): ImpactLine {
    const impact: Impact = impactCache.find((impact: Impact) => impact.id === impactId);
    return new ImpactLine(impact);
  }

  private getBiotypeLineById(biotypeId: number, biotypeCache: Array<Biotype>): BiotypeLine {
    const biotype: Biotype = biotypeCache.find((biotype: Biotype) => biotype.id === biotypeId);
    return new BiotypeLine(biotype);
  }

  get line(): VariantLine {
    return {
      ...this.geneLine.line,
      ...this.biotypeLine.line,
      ...this.effectLine.line,
      ...this.impactLine.line,
      transcript: this.transcript,
      sift: this.sift,
      hgvsp: this.hgvsp,
      hgvsc: this.hgvsc,
      polyphen: this.polyphen
    }
  }
}
