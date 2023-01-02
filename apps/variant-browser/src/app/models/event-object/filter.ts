export interface FilterAttribute {
  filter?: any;
  type: string;
}

export interface Filter {
  name: string;
  value: any;
  filterString: string;
  attributes?: Array<FilterAttribute>;
}
