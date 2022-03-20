import { TestBed } from '@angular/core/testing';

import { GenotypeTypesService } from './genotype-types.service';

describe('GenotypeTypesService', () => {
  let service: GenotypeTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenotypeTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
