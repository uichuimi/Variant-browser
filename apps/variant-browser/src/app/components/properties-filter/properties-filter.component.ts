import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { GlobalConstants } from "../../services/common/global-constants";
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { faCodeCompare, faHashtag, faKeyboard, faListCheck, faPlus, faTag } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ScreenBreakpointAttributeValue } from "../../directives/device-width-breakpoint.directive";
import { Subscription } from "rxjs";
import { Chromosome } from "../../services/api/varcan-service/models/response/Chromosome";
import { Effect } from "../../services/api/varcan-service/models/response/Effect";
import { Biotype } from "../../services/api/varcan-service/models/response/Biotype";
import { Filter, FilterAttribute } from "../../models/event-object/filter";
import { VariantParams } from "../../services/api/varcan-service/models/request/variant-params";
import { VarcanService } from "../../services/api/varcan-service/varcan.service";
import { GeneBodyParams } from "../../services/api/varcan-service/models/request/gene-body-params";
import { Gene } from "../../services/api/varcan-service/models/response/Gene";
import { VarcanAPIEntities } from "../../services/api/varcan-service/misc/varcan-api-entities";
import { VariantLineDatasourceService } from "../../services/data-source/variant-line/variant-line-datasource.service";

interface DropListOption {
  name: string;
  label: string;
  excludes?: Array<string>;
}

enum InputValueTypeEnum {
  NUMERIC,
  DROPLIST,
  STRING
}

@Component({
  selector: "app-properties-filter",
  templateUrl: "./properties-filter.component.html",
  styleUrls: ["./properties-filter.component.css"]
})
export class PropertiesFilterComponent implements OnInit, OnDestroy {
  filter: Filter;
  protected faPlus: IconDefinition = faPlus;
  protected faTag: IconDefinition = faTag;
  protected faListCheck: IconDefinition = faListCheck;
  protected faHashtag: IconDefinition = faHashtag;
  protected faKeyboard: IconDefinition = faKeyboard;
  protected faCodeCompare: IconDefinition = faCodeCompare;
  protected propertyFilterForm: FormGroup;
  protected allProperties: Array<DropListOption>;
  protected selectedProperty: Array<string>;
  protected allComparators: Array<DropListOption>;
  protected allSelectableComparators: Array<DropListOption>;
  protected allValues: Array<object>;
  protected selectedValues: Array<any>;
  protected stringValue: number;
  protected numericValue: string;
  protected defaultValueLabel: string;
  protected inputValueType: InputValueTypeEnum;
  protected propertyLabel: string;
  protected selectedComparator: Array<DropListOption>;
  protected appDeviceWidthBreakpointEvent: EventEmitter<string> = new EventEmitter<string>();
  protected propertyCtrlEvent: Subscription;
  protected layout: string;
  protected deviceBreakpointToggle: ScreenBreakpointAttributeValue = {
    lg: "horizontal",
    xl: "horizontal",
    default: "vertical"
  };

  constructor(private fb: FormBuilder,
              private globalConstants: GlobalConstants,
              private service: VarcanService,
              private dataSource: VariantLineDatasourceService) {
    this.allProperties = [
      VarcanAPIEntities.START,
      VarcanAPIEntities.END,
      VarcanAPIEntities.GENES,
      VarcanAPIEntities.BIOTYPES,
      VarcanAPIEntities.EFFECTS,
      VarcanAPIEntities.IMPACTS,
      VarcanAPIEntities.CHROMOSOMES,
      VarcanAPIEntities.IDENTIFIERS
    ];

    this.allComparators = [
      { name: "<", label: "Less than", excludes: ["start", "end"] },
      { name: "<=", label: "Less or equal than", excludes: ["start"] },
      { name: "==", label: "Equal to", excludes: ["start", "end"] },
      { name: "=!", label: "Distinct to", excludes: ["start", "end"] },
      { name: ">", label: "Greater than", excludes: ["start", "end"] },
      { name: ">=", label: "Greater or equal than", excludes: ["end"] }
    ];

    this.propertyFilterForm = fb.group({
      property: fb.control("", [Validators.required])
    });

    this.layout = this.deviceBreakpointToggle.default;
  }

  get propertyCtrl(): FormControl {
    return this.propertyFilterForm.get("property") as FormControl;
  }

  get comparatorCtrl(): FormControl {
    return this.propertyFilterForm.get("comparator") as FormControl;
  }

  get valueCtrl(): FormControl {
    return this.propertyFilterForm.get("value") as FormControl;
  }

  ngOnInit(): void {
    this.onPropertyCtrlValueChangeEvent();
    this.onDeviceDeviceWidthBreakPointEvent();
  }

  ngOnDestroy(): void {
    this.propertyCtrlEvent.unsubscribe();
    this.appDeviceWidthBreakpointEvent.unsubscribe();
  }

  async onDeleteFilter($event: Filter) {
    const propertyName: string = $event.name;
    const propertyValue: any = $event.value;
    console.log(propertyName, propertyValue);
    this.dataSource.deletePropertyFilter(propertyName, propertyValue);
    await this.dataSource.updateVariantLine();
  }

  protected async onSubmit() {
    if (this.propertyFilterForm.valid) {
      const propertyKey = this.propertyFilterForm.value.property;
      const propertyComparator = this.propertyFilterForm.value.comparator;
      const propertyValue = this.propertyFilterForm.value.value;
      const value = await this.managePropertyValues(propertyKey, propertyValue);

      this.addFilterItem(propertyKey, propertyComparator, propertyValue);
      this.dataSource.addPropertyFilter(propertyKey, value);
      await this.dataSource.updateVariantLine();
    } else {
      console.error("Invalid submission: ", this.propertyFilterForm);
    }
  }

  protected isValueTypeNumeric() {
    return this.inputValueType === InputValueTypeEnum.NUMERIC;
  }

  protected isValueTypeDropList() {
    return this.inputValueType === InputValueTypeEnum.DROPLIST;
  }

  protected isValueTypeString() {
    return this.inputValueType === InputValueTypeEnum.STRING;
  }

  protected getValueIcon(): IconDefinition {
    if (this.isValueTypeNumeric()) {
      return this.faHashtag;
    } else if (this.isValueTypeString()) {
      return this.faKeyboard;
    } else {
      return this.faListCheck;
    }
  }

  private onDeviceDeviceWidthBreakPointEvent() {
    this.appDeviceWidthBreakpointEvent.subscribe((value) => {
      this.layout = this.getLayout(value);
    });
  }

  private onPropertyCtrlValueChangeEvent() {
    this.propertyCtrlEvent = this.propertyCtrl.valueChanges
      .subscribe((property: string) => {
        if (property != null) {
          this.generateResponsiveFields(property);
        } else {
          this.propertyFilterForm.removeControl("comparator");
          this.propertyFilterForm.removeControl("value");
        }
        this.propertyFilterForm.updateValueAndValidity();
      });
  }

  private generateResponsiveFields(property: string) {
    const capitalizeProperty = property.charAt(0).toUpperCase() + property.substring(1);
    this.propertyLabel = capitalizeProperty;
    const variantParams: VariantParams = this.dataSource.getVariantParams();
    const numericProperties = ["start", "end"];
    const stringProperties = ["genes", "identifiers"];
    let validators: Array<ValidatorFn> = [Validators.required, Validators.min(0)];

    if (numericProperties.includes(property)) {
      this.inputValueType = InputValueTypeEnum.NUMERIC;
      if (variantParams !== undefined) {
        if (property === VarcanAPIEntities.START.name
          && VarcanAPIEntities.END.name in variantParams) {
          const end: number = variantParams.end;
          validators.push(Validators.max(end));
        } else if (property == VarcanAPIEntities.END.name
          && VarcanAPIEntities.START.name in variantParams) {
          const start: number = variantParams.start;
          validators.push(Validators.min(start));
        }
      }
      this.generateResponsiveComparatorField(property);
    } else if (!stringProperties.includes(property)) {
      this.inputValueType = InputValueTypeEnum.DROPLIST;
      this.propertyFilterForm.removeControl("comparator");
      this.generateResponsiveDropListField(property, capitalizeProperty);
    } else {
      this.propertyFilterForm.removeControl("comparator");
      this.inputValueType = InputValueTypeEnum.STRING;
    }

    const valueInput: FormControl = new FormControl(
      "",
      validators
    );
    console.log(valueInput, validators);
    this.propertyFilterForm
      .addControl("value", valueInput);
  }

  private generateResponsiveComparatorField(property: string) {
    this.allSelectableComparators = this.allComparators.filter((comparator) => !comparator.excludes.includes(property));
    const comparator: FormControl = new FormControl("", [Validators.required]);
    this.propertyFilterForm
      .addControl("comparator", comparator);
  }

  private generateResponsiveDropListField(property: string, capitalizeProperty: string) {
    this.extractPropertyAPIData(property, capitalizeProperty);
    this.generateValueOptionLabels(property);
  }

  private extractPropertyAPIData(property: string, capitalizeProperty: string) {
    this.defaultValueLabel = `Select ${property}`;
    const method: any = `get${capitalizeProperty}`;
    this.allValues = this.globalConstants.run(this.globalConstants, method);
  }

  private generateValueOptionLabels(property: string) {
    switch (property) {
      case VarcanAPIEntities.CHROMOSOMES.name:
        this.allValues = this.allValues.map((chromosome: Chromosome) => {
          chromosome["label"] = `${chromosome.ucsc} / ${chromosome.genebank} / ${chromosome.refseq}`;
          return chromosome;
        });
        break;
      case VarcanAPIEntities.EFFECTS.name:
        this.allValues = this.allValues.map((effect: Effect) => {
          const description = effect.description.replace(/_/g, " ");
          effect["label"] = `${effect.accession} / ${description} (${effect.impact.name})`;
          return effect;
        });
        break;
      case VarcanAPIEntities.BIOTYPES.name:
        this.allValues = this.allValues.map((biotype: Biotype) => {
          const name = biotype.name.replace(/_/g, " ");
          biotype["label"] = `${biotype.accession} / ${name}`;
          return biotype;
        });
        break;
      default:
        this.allValues = this.allValues.map((value: object) => {
          value["label"] = value["name"];
          return value;
        });
        break;
    }
  }

  private getLayout(value: string): string {
    if (Object.keys(this.deviceBreakpointToggle).includes(value)) {
      return this.deviceBreakpointToggle[value];
    } else {
      return this.deviceBreakpointToggle.default;
    }
  }

  private addFilterItem(propertyKey: string, propertyComparator: string, propertyValue: any) {
    let filterStr: string;
    switch (this.inputValueType) {
      case InputValueTypeEnum.NUMERIC:
        filterStr = `${propertyKey} ${propertyComparator} ${propertyValue}`;
        break;
      default:
        const propertyValueNames = this.getPropertyValueNames(propertyKey, propertyValue);
        filterStr = `${propertyKey} in [${propertyValueNames}]`;
        break;
    }

    const attributes: Array<FilterAttribute> = filterStr.split(" ")
      .map((word: string) => {
        return { filter: word, type: word === "in" ? "text" : "chip" };
      });
    this.filter = {
      name: propertyKey,
      value: propertyValue,
      filterString: filterStr,
      attributes: attributes
    };
  }

  private getPropertyValueNames(propertyKey: string, propertyValue: Array<number>) {
    if (propertyKey == VarcanAPIEntities.GENES.name || propertyKey == VarcanAPIEntities.IDENTIFIERS.name) {
      return propertyValue;
    }

    const filteredValues = this.allValues
      .filter((object) => propertyValue.includes(object["id"]));
    switch (propertyKey) {
      case VarcanAPIEntities.CHROMOSOMES.name:
        return filteredValues.map((chromosome: Chromosome) => chromosome.ucsc);
      case VarcanAPIEntities.EFFECTS.name:
        return filteredValues.map((effect: Effect) => effect.description);
      default:
        return filteredValues.map((object) => object["name"]);
    }
  }

  private async managePropertyValues(propertyKey: string, propertyValue: any) {
    const variantParams: VariantParams = this.dataSource.getVariantParams();
    const existingValue = variantParams[propertyKey];
    switch (propertyKey) {
      case VarcanAPIEntities.GENES.name:
        const genesRequest: GeneBodyParams = { names: propertyValue };
        propertyValue = await this.service.getBatchGenes(genesRequest)
          .then(response => response.data);
        const geneIds = propertyValue.map((gene: Gene) => gene.id);
        if (propertyKey in variantParams) {
          return this.unionTwoArrays(existingValue, geneIds);
        }
        return geneIds;
      default:
        if (existingValue !== undefined &&
          typeof existingValue === "object" &&
          typeof propertyValue === "object") {
          return this.unionTwoArrays(existingValue, propertyValue);
        }
        return propertyValue;
    }
  }

  private unionTwoArrays(firstSet, secondSet) {
    let union = [...firstSet, ...secondSet];
    return union
      .filter((value, index, self) => self.indexOf(value) === index);
  }
}
