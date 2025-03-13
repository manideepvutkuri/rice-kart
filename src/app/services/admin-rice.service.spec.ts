import { TestBed } from '@angular/core/testing';

import { AdminRiceService } from './admin-rice.service';

describe('AdminRiceService', () => {
  let service: AdminRiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
