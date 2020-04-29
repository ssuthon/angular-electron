import { Injectable } from '@angular/core';


export abstract class Logger {
  debug: any;
  info: any;
  warn: any;
  error: any;
}

@Injectable()
export class LoggerService implements Logger {
  debug: any;
  info: any;
  warn: any;
  error: any;
} 