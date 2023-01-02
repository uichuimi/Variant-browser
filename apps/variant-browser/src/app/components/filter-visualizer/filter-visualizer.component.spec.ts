import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterVisualizerComponent } from './filter-visualizer.component';

describe('FilterVisualizerComponent', () => {
  let component: FilterVisualizerComponent;
  let fixture: ComponentFixture<FilterVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterVisualizerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
