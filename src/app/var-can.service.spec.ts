import { TestBed } from '@angular/core/testing';

import { VarCanService } from './var-can.service';

describe('VarCanService', () => {
  let service: VarCanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VarCanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
