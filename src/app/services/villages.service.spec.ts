import { TestBed } from '@angular/core/testing';

import { VillagesService } from './villages.service';

describe('VillagesService', () => {
  let service: VillagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VillagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
