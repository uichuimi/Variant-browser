export interface GenotypeLine {
  [name: string]: any;
  individual: string;
  genotype: string;
  refCount: number;
  altCount: number;
}
