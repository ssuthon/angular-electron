import { TestBed } from '@angular/core/testing';

import { SerialDeviceService } from './serial-device.service';

describe('SerialDeviceService', () => {
  let service: SerialDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
