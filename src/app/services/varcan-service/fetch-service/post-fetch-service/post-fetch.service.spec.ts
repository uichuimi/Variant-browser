import { TestBed } from '@angular/core/testing';

import { PostFetchService } from './post-fetch.service';

describe('PostFetchService', () => {
  let service: PostFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
