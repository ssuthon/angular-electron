import { Injectable } from '@angular/core';

import { Logger } from './logger.service';
import { AppConfig } from '../../../environments/environment';
import { ElectronService } from './electron/electron.service';

const isDebugMode = AppConfig.isDebugMode
const noop = (): any => undefined;

@Injectable()
export class ElectronLoggerService implements Logger {
  constructor(
    private electronService: ElectronService
  ){}

  get debug() {
    if (isDebugMode) {
      return this._debug;
    } else {
      return noop;
    }
  }

  get info() {
    if (isDebugMode) {
      return this._info;
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return this._warn;
    } else {
      return noop;
    }
  }

  get error() {
    if (isDebugMode) {
      return this._error;
    } else {
      return noop;
    }
  }

  _debug(...args: any[]){    
    this.electronService.ipcRenderer.send('log/debug',  ...args)
  }
  
  _info(...args: any[]){
    this.electronService.ipcRenderer.send('log/info',  ...args)
  }
  
  _warn(...args: any[]){
    this.electronService.ipcRenderer.send('log/warn', ...args)
  }

  _error(...args: any[]){
    this.electronService.ipcRenderer.send('log/error', ...args)
  }
}