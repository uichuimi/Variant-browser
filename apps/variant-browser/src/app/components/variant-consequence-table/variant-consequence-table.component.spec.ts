import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantConsequenceTableComponent } from './variant-consequence-table.component';

describe('VariantConsequenceTableComponent', () => {
  let component: VariantConsequenceTableComponent;
  let fixture: ComponentFixture<VariantConsequenceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantConsequenceTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantConsequenceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
