import {Effect} from "./Effect";
import {Impact} from "./Impact";
import {Transcript} from "./Transcript";

export interface Consequence {
  effect: Effect;
  polyphen: number;
  sift: number;
  transcript: Transcript;
  hgvsc: string;
  hgvsp: string;
  impact: Impact;
}
