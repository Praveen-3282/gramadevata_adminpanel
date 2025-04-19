import { TestBed } from '@angular/core/testing';

import { GoshalaService } from './goshala.service';

describe('GoshalaService', () => {
  let service: GoshalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoshalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
