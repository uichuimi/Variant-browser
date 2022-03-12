import { TestBed } from '@angular/core/testing';

import { GetFetchService } from './get-fetch.service';

describe('GetFetchService', () => {
  let service: GetFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
