interface VarcanAPIEntityAttribute {
  name: string;
  label: string;
}

interface VarcanAPIEntity {

  START: VarcanAPIEntityAttribute;
  END: VarcanAPIEntityAttribute;
  IDENTIFIERS: VarcanAPIEntityAttribute;
  CHROMOSOMES: VarcanAPIEntityAttribute;
  GENES: VarcanAPIEntityAttribute;
  EFFECTS: VarcanAPIEntityAttribute;
  IMPACTS: VarcanAPIEntityAttribute;
  GENOTYPE_TYPE: VarcanAPIEntityAttribute;
  POPULATIONS: VarcanAPIEntityAttribute;
  INDIVIDUALS: VarcanAPIEntityAttribute;
  VARIANTS: VarcanAPIEntityAttribute;
  BIOTYPES: VarcanAPIEntityAttribute;
}

export const VarcanAPIEntities: VarcanAPIEntity = {
  START: { name: "start", label: "Start" },
  END: { name: "end", label: "End" },
  IDENTIFIERS: { name: "identifiers", label: "Variant ID" },
  CHROMOSOMES: { name: "chromosomes", label: "Chromosomes" },
  GENES: { name: "genes", label: "Genes" },
  EFFECTS: { name: "effects", label: "Effects" },
  IMPACTS: { name: "impacts", label: "Impacts" },
  GENOTYPE_TYPE: { name: "genotypeType", label: "Genotype" },
  POPULATIONS: { name: "population", label: "Populations" },
  INDIVIDUALS: { name: "individual", label: "Individuals" },
  VARIANTS: { name: "variants", label: "Variants" },
  BIOTYPES: { name: "biotypes", label: "Biotypes" }
}
