import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantFilterPanelComponent } from './variant-filter-panel.component';

describe('VariantFilterPanelComponent', () => {
  let component: VariantFilterPanelComponent;
  let fixture: ComponentFixture<VariantFilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantFilterPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantFilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
