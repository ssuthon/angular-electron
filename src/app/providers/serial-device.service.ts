import { Injectable, NgZone } from '@angular/core';
import { ipcRenderer } from 'electron';
import * as _ from 'lodash';

import { ElectronService } from '../core/services/electron/electron.service';
import { LoggerService } from '../core/services/logger.service';
import { Subject } from 'rxjs';

interface RemoveableDeviceSpec {
  vendorId: number, productId: number
}

export class DeviceEndpoint {
  private channel: string
  readonly data$ = new Subject<string>()
  devicePath: string
  connected = false

  constructor(
    readonly name: string,
    private ipc: typeof ipcRenderer,
    readonly spec?: RemoveableDeviceSpec
  ) {
  }

  open(devicePath: string) {
    this.channel = `serialport/onData/${devicePath}`
    console.log(this.channel)
    this.ipc.on(this.channel, (event, data: string) => {      
      data = data.replace(/\W/g, '')      
      this.data$.next(data)
    })
    this.ipc.send("serialport/open", devicePath)
    this.connected = true
  }

  write(command: string) {
    if (this.connected)
      this.ipc.send("serialport/write", this.devicePath, command)
  }

  disconnect() {
    //this.ipc.removeAllListeners(this.channel)
    this.connected = false
  }

  isRemovable() {
    return this.spec ? true : false
  }

}

@Injectable({
  providedIn: 'root'
})
export class SerialDeviceService {

  endpoints: { [name: string]: DeviceEndpoint } = {}
  private removableEndpoints: DeviceEndpoint[] = []
  removableEndpointChanged$ = new Subject<string>()
  availablePorts = []

  constructor(
    private electronService: ElectronService,
    private log: LoggerService,
  ) {
    this.electronService.ipcRenderer.on('serialport/onList', (event, data: any[]) => {
      this.availablePorts = data      
      this.checkRemovableEndpoint()   
    })
    this.electronService.ipcRenderer.send("serialport/listWithDetection")    
  }

  private checkRemovableEndpoint() {
    _.forEach(this.removableEndpoints, ep => {
      let port_info = this.find_port(ep.spec.vendorId, ep.spec.productId)
      if (port_info) {
        if (!ep.connected) {
          //present
          this.log.debug(`openning port ${port_info.path}`)
          ep.open(port_info.path)
          this.removableEndpointChanged$.next(ep.name)
        }
      } else {
        if (ep.connected) {
          //absent
          ep.disconnect()
          this.removableEndpointChanged$.next(ep.name)
        }
      }
    })
  }

  createEndpoint(name: string, devicePath: string): DeviceEndpoint {
    this.removeEndPoint(name)
    
    const ep = new DeviceEndpoint(name, this.electronService.ipcRenderer)
    this.log.debug(`openning port ${devicePath}`)
    ep.open(devicePath)
    this.endpoints[name] = ep
    return ep
  }

  createRemovableEndPoint(name: string, vendorId: number, productId: number): DeviceEndpoint {
    this.removeEndPoint(name)

    const ep = new DeviceEndpoint(name, this.electronService.ipcRenderer, { vendorId, productId })
    let port_info = this.find_port(vendorId, productId)
    if (port_info) {
      this.log.debug(`openning port ${port_info.path}`)
      ep.open(port_info.path)      
    }
    this.endpoints[name] = ep
    this.updateRemovableEndpoints()    
    return ep
  }

  private find_port(vendorId: number, productId: number) {
    return _.find(this.availablePorts, port => vendorId == parseInt(port.vendorId, 16) && productId == parseInt(port.productId, 16))
  }


  removeEndPoint(name: string) {
    const endpoint = this.endpoints[name]
    if (endpoint) {
      endpoint.disconnect()
      delete this.endpoints[name]
    }
  }

  private updateRemovableEndpoints() {
    this.removableEndpoints = _.filter(_.values(this.endpoints), ep => ep.isRemovable())
  }

}
