import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantGenotypeTableComponent } from './variant-genotype-table.component';

describe('VariantGenotypeTableComponent', () => {
  let component: VariantGenotypeTableComponent;
  let fixture: ComponentFixture<VariantGenotypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantGenotypeTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantGenotypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
