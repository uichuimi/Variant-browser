import { TestBed } from '@angular/core/testing';

import { VariantLineDatasourceService } from './variant-line-datasource.service';

describe('VariantLineDatasourceService', () => {
  let service: VariantLineDatasourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariantLineDatasourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
