import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenotypeFilterComponent } from './genotype-filter.component';

describe('GenotypeFilterComponent', () => {
  let component: GenotypeFilterComponent;
  let fixture: ComponentFixture<GenotypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenotypeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenotypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
