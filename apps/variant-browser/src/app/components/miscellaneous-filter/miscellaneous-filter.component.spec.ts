import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiscellaneousFilterComponent } from './miscellaneous-filter.component';

describe('MiscellaneousFilterComponent', () => {
  let component: MiscellaneousFilterComponent;
  let fixture: ComponentFixture<MiscellaneousFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MiscellaneousFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiscellaneousFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
