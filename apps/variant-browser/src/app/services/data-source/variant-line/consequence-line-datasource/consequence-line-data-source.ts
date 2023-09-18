import { Consequence } from "../../../api/varcan-service/models/response/Consequence";
import { Gene } from "../../../api/varcan-service/models/response/Gene";
import { Biotype } from "../../../api/varcan-service/models/response/Biotype";
import { Impact } from "../../../api/varcan-service/models/response/Impact";
import { Effect } from "../../../api/varcan-service/models/response/Effect";
import { GeneLineDataSource } from "./gene-line-data-source";
import { BiotypeLineDataSource } from "./biotype-line-data-source";
import { EffectLineDataSource } from "./effect-line-data-source";
import { VariantLine } from "../../models/variant-line";
import { ImpactLineDataSource } from "./impact-line-data-source";
import { ConsequenceLine } from "../../models/consequence-line";

export class ConsequenceLineDataSource {
  private geneLine: GeneLineDataSource;
  private biotypeLine: BiotypeLineDataSource;
  private impactLine: ImpactLineDataSource;
  private effectLine: EffectLineDataSource;
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


  private getGeneLineById(geneId: number, geneCache: Array<Gene>, biotypeCache: Array<Biotype>): GeneLineDataSource {
    const gene: Gene = geneCache
      .find((gene: Gene) => gene.id === geneId);

    if (gene != null && gene.biotype) {
      this.biotypeLine = this.getBiotypeLineById(gene.biotype.id, biotypeCache);
    } else {
      this.biotypeLine = new BiotypeLineDataSource(null);
    }

    return new GeneLineDataSource(gene);
  }

  private getEffectLineById(effectId: number, effectCache: Array<Effect>): EffectLineDataSource {
    const effect: Effect = effectCache.find((effect: Effect) => effect.id === effectId);
    return new EffectLineDataSource(effect);
  }

  private getImpactLineById(impactId: number, impactCache: Array<Impact>): ImpactLineDataSource {
    const impact: Impact = impactCache.find((impact: Impact) => impact.id === impactId);
    return new ImpactLineDataSource(impact);
  }

  private getBiotypeLineById(biotypeId: number, biotypeCache: Array<Biotype>): BiotypeLineDataSource {
    const biotype: Biotype = biotypeCache.find((biotype: Biotype) => biotype.id === biotypeId);
    return new BiotypeLineDataSource(biotype);
  }

  get line(): ConsequenceLine {
    return {
      ...this.geneLine.line,
      ...this.biotypeLine.line,
      ...this.effectLine.line,
      ...this.impactLine.line,
      transcript: this.transcript,
      sift: this.sift,
      hgvsp: this.hgvsp,
      hgvsc: this.hgvsc,
      polyphen: this.polyphen,
    }
  }
}
