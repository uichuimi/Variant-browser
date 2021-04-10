import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenotypesComponent } from './genotypes.component';

describe('GenotypesComponent', () => {
  let component: GenotypesComponent;
  let fixture: ComponentFixture<GenotypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenotypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenotypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
