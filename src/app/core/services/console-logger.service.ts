import { Injectable } from '@angular/core';
import { AppConfig } from '../../../environments/environment';
import { Logger } from './logger.service';

export let isDebugMode = AppConfig.isDebugMode;

const noop = (): any => undefined;

@Injectable()
export class ConsoleLoggerService implements Logger {

  get debug() {
    if (isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    if (isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }
}