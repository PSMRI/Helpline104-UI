import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class CaptchaService {
  private scriptLoaded = false;

  loadScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.scriptLoaded) return resolve();

      const script = document.createElement('script');
      script.src = environment.captchaChallengeURL;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = (event) => {
        this.scriptLoaded = false;
        reject(
          new Error(
            `Failed to load CAPTCHA script from ${environment.captchaChallengeURL}: ${event}`,
          ),
        );
      };
      document.head.appendChild(script);
    });
  }
}