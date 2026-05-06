import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private readonly SECRET_KEY = environment.encKey || 'default-key';

  setItem(key: string, value: any): void {
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    const ciphertext = CryptoJS.AES.encrypt(text, this.SECRET_KEY).toString();
    sessionStorage.setItem(key, ciphertext);
  }

  getItem(key: string): any {
    const text = sessionStorage.getItem(key);
    if (text) {
      const bytes = CryptoJS.AES.decrypt(text, this.SECRET_KEY);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      try {
        return JSON.parse(originalText);
      } catch {
        return originalText;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }

  setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}
