import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    service = new ApiService(environment.serverUrl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
