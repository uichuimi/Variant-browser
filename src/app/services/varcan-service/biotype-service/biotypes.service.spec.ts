import { TestBed } from '@angular/core/testing';

import { BiotypesService } from './biotypes.service';

describe('BiotypesService', () => {
  let service: BiotypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiotypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
