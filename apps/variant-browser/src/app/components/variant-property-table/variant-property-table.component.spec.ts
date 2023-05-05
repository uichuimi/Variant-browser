import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantPropertyTableComponent } from './variant-property-table.component';

describe('VariantPropertyTableComponent', () => {
  let component: VariantPropertyTableComponent;
  let fixture: ComponentFixture<VariantPropertyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantPropertyTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantPropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
