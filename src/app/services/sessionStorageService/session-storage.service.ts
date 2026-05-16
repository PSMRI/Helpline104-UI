/* 
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class sessionStorageService {

    SECRET_KEY = environment.encKey;
    
    constructor() {}
  
    setItem(key: string, value: any): void {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      const keyToUse = this.SECRET_KEY || 'FALLBACK_INSECURE_KEY_CHANGE_ME';
      const ciphertext = CryptoJS.AES.encrypt(stringValue, keyToUse).toString();
      sessionStorage.setItem(key, ciphertext);
    }
  
    getItem(key: string): any | null {
      let text = sessionStorage.getItem(key);
      if (text && text !== null) {
        const keyToUse = this.SECRET_KEY || 'FALLBACK_INSECURE_KEY_CHANGE_ME';
        const bytes = CryptoJS.AES.decrypt(text, keyToUse);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        
        try {
          return JSON.parse(originalText);
        } catch (e) {
          return originalText; // Return as string if not JSON
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
  
    setCookie(name, value, days) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      // Added SameSite=Lax for CSRF protection
      document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    getCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
}