import { TestBed } from '@angular/core/testing';

import { VariantApiService } from './variant-api.service';

describe('VariantApiService', () => {
  let service: VariantApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariantApiService);
    //TRIAL
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
