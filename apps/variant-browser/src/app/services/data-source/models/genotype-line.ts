export interface GenotypeLine {
  [name: string]: any;
  sample: string;
  genotype: string;
  refCount: number;
  altCount: number;
}
