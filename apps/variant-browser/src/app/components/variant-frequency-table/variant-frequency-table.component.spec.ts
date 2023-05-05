import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantFrequencyTableComponent } from './variant-frequency-table.component';

describe('VariantFrequencyTableComponent', () => {
  let component: VariantFrequencyTableComponent;
  let fixture: ComponentFixture<VariantFrequencyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantFrequencyTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantFrequencyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
