import { TestBed } from '@angular/core/testing';

import { PopulationsService } from './populations.service';

describe('PopulationsService', () => {
  let service: PopulationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
