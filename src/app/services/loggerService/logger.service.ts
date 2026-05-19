import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoggerService {
  // Only log if not in production environment
  private isEnabled = !environment.production;

  debug(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.log(message, ...optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.info(message, ...optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]) {
    if (this.isEnabled) {
      console.error(message, ...optionalParams);
    }
  }
}
