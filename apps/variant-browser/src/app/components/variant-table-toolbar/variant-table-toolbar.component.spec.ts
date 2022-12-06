import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantTableToolbarComponent } from './variant-table-toolbar.component';

describe('VariantTableToolbarComponent', () => {
  let component: VariantTableToolbarComponent;
  let fixture: ComponentFixture<VariantTableToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantTableToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariantTableToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
