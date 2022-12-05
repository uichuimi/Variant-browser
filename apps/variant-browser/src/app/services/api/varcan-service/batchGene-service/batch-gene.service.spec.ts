import { TestBed } from '@angular/core/testing';

import { BatchGeneService } from './batch-gene.service';

describe('BatchGeneService', () => {
  let service: BatchGeneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchGeneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
