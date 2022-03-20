import { TestBed } from '@angular/core/testing';

import { ImpactsService } from './impacts.service';

describe('ImpactsService', () => {
  let service: ImpactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
