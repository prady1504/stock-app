import { TestBed } from '@angular/core/testing';

import { MockStockService } from './mock-stock.service';

describe('MockStockService', () => {
  let service: MockStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
