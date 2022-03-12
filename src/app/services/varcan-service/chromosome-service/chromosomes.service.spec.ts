import { TestBed } from '@angular/core/testing';

import { ChromosomesService } from './chromosomes.service';

describe('ChromosomesService', () => {
  let service: ChromosomesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChromosomesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
