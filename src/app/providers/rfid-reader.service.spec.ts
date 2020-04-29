import { TestBed } from '@angular/core/testing';

import { RfidReaderService } from './rfid-reader.service';

describe('RfidReaderService', () => {
  let service: RfidReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfidReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
