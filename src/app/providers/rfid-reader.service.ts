import { Injectable } from '@angular/core';
import { SerialDeviceService, DeviceEndpoint } from './serial-device.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RfidReaderService {
  endpoint: DeviceEndpoint
  constructor(
    private serialDeviceService: SerialDeviceService
  ) {
    this.endpoint = this.serialDeviceService.createRemovableEndPoint("rfid", parseInt('0403', 16), parseInt('6001', 16))
    this.endpoint.data$.subscribe(tag => {
      console.log(tag)
    })

    this.serialDeviceService.removableEndpointChanged$.pipe(
      filter(name => name == 'rfid')
    ).subscribe(path => {
      console.log(`device connection = ${this.endpoint.connected}`)
    })
  }
}
