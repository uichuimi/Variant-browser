import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyFilterComponent } from './frequency-filter.component';

describe('FrequencyFilterComponent', () => {
  let component: FrequencyFilterComponent;
  let fixture: ComponentFixture<FrequencyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrequencyFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrequencyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
