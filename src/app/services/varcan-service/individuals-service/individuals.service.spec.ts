import { TestBed } from '@angular/core/testing';

import { IndividualsService } from './individuals.service';

describe('IndividualsService', () => {
  let service: IndividualsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
