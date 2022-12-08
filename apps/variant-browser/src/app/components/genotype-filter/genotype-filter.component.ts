import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { GenotypeFilterParams } from "../../models/input/GenotypeFilterParams";
import { VariantParams } from "../../models/input/VariantParams";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { map, Observable, startWith } from "rxjs";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { GlobalConstants } from "../../services/common/global-constants";
import { Individual } from "../../models/output/Individual";
import { GenotypeType } from "../../models/output/GenotypeType";

interface OperatorMeta {
  selector: string;
  label: string;
}

@Component({
  selector: 'app-genotype-filter',
  templateUrl: './genotype-filter.component.html',
  styleUrls: ['./genotype-filter.component.css']
})
export class GenotypeFilterComponent implements OnInit {
  @ViewChild('arityInput') arityInput;
  @Input() variantParams: VariantParams;
  private genotypeParams: Array<GenotypeFilterParams> = new Array<GenotypeFilterParams>();
  protected genotypeFilterForm: FormGroup;
  protected selectedSelectors: Array<string> = [];
  protected allSelectors: Array<OperatorMeta> = [
    { selector: "ANY", label: "Any" },
    { selector: "ALL", label: "All" },
    { selector: "NONE", label: "None" }
  ];
  protected selectedSamples: Array<Individual> = [];
  protected allSamples: Array<Individual>;
  protected filteredSamples: Observable<Array<Individual>>;
  protected searchInputCtrl: FormControl = new FormControl<any>('');
  protected allGenotypes: Array<GenotypeType>;
  protected filteredOperators: Observable<Array<string>>
  protected separatorKeysCodes: Array<number> = [ENTER, COMMA];

  constructor(private fb: FormBuilder, protected globalConstants: GlobalConstants) {
    this.genotypeFilterForm = fb.group({
      genotypeFilters: fb.group({
        individual: fb.control([], [Validators.required]),
        genotypeType: fb.control([], [Validators.required]),
        selector: fb.control('', [Validators.required])
      })
    });

    this.allSamples = this.globalConstants.getIndividuals();
    this.allGenotypes = this.globalConstants.getGenotypeTypes();

    this.individualCtrl.valueChanges.subscribe((selectedSamples: Array<number>) => {
      if (selectedSamples == null) return;
      this.selectedSamples = this.selectedSamples
        .filter((sample: Individual, index: number, array: Array<Individual>) => {
          return array.indexOf(sample) === index;
        })
    });
  }

  ngOnInit(): void {
    this.selectorCtrl.valueChanges.subscribe(selector => {
      if (selector == 'Any') {
        this.genotypeFiltersCtrl.addControl(
          'number',
          new FormControl(1, [Validators.required, Validators.min(1)])
        )
      } else {
        this.genotypeFiltersCtrl.removeControl('number');
      }
      this.genotypeFiltersCtrl.updateValueAndValidity();
    });

    this.filteredSamples = this.searchInputCtrl.valueChanges.pipe(
      startWith(null),
      map((sample: string | null) => {
        return sample ? this.filterSamples(sample) : this.allSamples.slice();
      }),
    );
  }

  get genotypeFiltersCtrl(): FormGroup {
    return this.genotypeFilterForm.get('genotypeFilters') as FormGroup;
  }

  get selectorCtrl(): FormControl {
    return this.genotypeFilterForm.get('genotypeFilters.selector') as FormControl;
  }

  get genotypeTypeCtrl(): FormControl {
    return this.genotypeFilterForm.get('genotypeFilters.genotypeType') as FormControl;
  }

  get individualCtrl(): FormControl {
    return this.genotypeFilterForm.get('genotypeFilters.individual') as FormControl;
  }

  get numberCtrl(): FormControl {
    return this.genotypeFilterForm.get('genotypeFilters.number') as FormControl;
  }

  private filterSamples(value: string): Array<Individual> {
    const filterCode: string = value.toLowerCase();
    return this.allSamples
      .filter((sample: Individual) => sample.code.toLowerCase().includes(filterCode));
  }

  onSubmit() {
    console.log("SUBMIT");
  }

  onInputSampleTokenEnd($event: MatChipInputEvent) {
    const value = ($event.value || '').trim();
    const foundSample: Individual = this.allSamples
      .find((sample: Individual) => sample.code === value);

    if (value && foundSample) {
      this.selectedSamples.push(this.allSamples.find((sample: Individual) => sample.code === value));
    }

    $event.chipInput!.clear();
    this.individualCtrl.setValue(null);
  }

  onRemoveSampleChip(code: string) {
    const index = this.selectedSamples.findIndex((sample: Individual) => sample.code === code);

    if (index >= 0) {
      this.selectedSamples.splice(index, 1);
    }
  }

  onChangedSelectedSample($event: MatAutocompleteSelectedEvent) {
    const value = $event.option.viewValue;
    this.selectedSamples.push(this.allSamples.find((sample: Individual) => sample.code === value));
    this.searchInputCtrl.setValue(null);
  }

  onDeleteButtonClicked() {
    this.arityInput.value = '';
  }
}
