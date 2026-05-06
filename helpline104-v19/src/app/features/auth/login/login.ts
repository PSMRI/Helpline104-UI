import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '@/core/services/login.service';
import { AuthService } from '@/core/services/auth.service';
import { SessionStorageService } from '@/core/services/session-storage.service';
import { DataService } from '@/core/services/data.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUser, lucideLock, lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    ZardButtonComponent, 
    ZardInputDirective, 
    NgIcon
  ],
  providers: [provideIcons({ lucideUser, lucideLock, lucideEye, lucideEyeOff })],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg border border-gray-100">
        <div class="text-center">
          <img class="mx-auto h-16 w-auto" src="assets/images/Swasthya.png" alt="Piramal Swasthya">
        </div>
        
        <form class="mt-8 space-y-6" #loginForm="ngForm" (ngSubmit)="onLogin()">
          <div class="space-y-4 rounded-md">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ng-icon name="lucideUser" class="text-gray-400" />
              </div>
              <input
                z-input
                name="userID"
                [(ngModel)]="userID"
                required
                type="text"
                placeholder="Enter User Name *"
                class="block w-full pl-10"
              />
            </div>
            
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ng-icon name="lucideLock" class="text-gray-400" />
              </div>
              <input
                z-input
                name="password"
                [(ngModel)]="password"
                required
                [type]="showPassword() ? 'text' : 'password'"
                placeholder="Enter Password *"
                class="block w-full pl-10"
              />
              <button
                type="button"
                (click)="togglePassword()"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <ng-icon [name]="showPassword() ? 'lucideEyeOff' : 'lucideEye'" />
              </button>
            </div>
          </div>

          @if (loginResult()) {
            <div class="text-center text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
              {{ loginResult() }}
            </div>
          }

          <div>
            <button
              z-button
              zFull
              type="submit"
              [zLoading]="isLoading()"
              [zDisabled]="loginForm.invalid || isLoading()"
            >
              Login
            </button>
          </div>

          <div class="flex items-center justify-end">
            <div class="text-sm">
              <a routerLink="/reset-password" class="font-medium text-blue-600 hover:text-blue-500">
                Forgot Password?
              </a>
            </div>
          </div>
        </form>
      </div>
      
      <footer class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 px-4 py-3">
        <div class="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-500">
          <div>Powered by: WIPRO</div>
          <div class="my-1 sm:my-0">2025 © PSMRI</div>
          <div class="flex space-x-4">
             <a class="hover:text-blue-600 cursor-pointer">Feedback</a>
             <span>Version 19.0</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoginComponent implements OnDestroy {
  private loginService = inject(LoginService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private sessionService = inject(SessionStorageService);
  private dataService = inject(DataService);

  userID = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  loginResult = signal('');

  private readonly SALT = "RandomInitVector";
  private readonly Key_IV = "Piramal12Piramal";
  private readonly _keySize = 256;
  private readonly _ivSize = 128;
  private readonly _iterationCount = 1989;

  private generateKey(salt: string, passPhrase: string) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      hasher: CryptoJS.algo.SHA512,
      keySize: this._keySize / 32,
      iterations: this._iterationCount
    });
  }

  private encryptWithIvSalt(salt: string, iv: string, passPhrase: string, plainText: string) {
    const key = this.generateKey(salt, passPhrase);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  private encryptPassword(passPhrase: string, plainText: string) {
    const iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    const salt = CryptoJS.lib.WordArray.random(this._keySize / 8).toString(CryptoJS.enc.Hex);
    const ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
    return salt + iv + ciphertext;
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onLogin() {
    if (!this.userID || !this.password) return;

    this.isLoading.set(true);
    this.loginResult.set('');
    
    const encryptedPassword = this.encryptPassword(this.Key_IV, this.password);
    
    this.loginService.authenticateUser(this.userID, encryptedPassword, false).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        // Store session data
        if (res && res.previlegeObj && res.previlegeObj.length > 0) {
          
          this.dataService.Userdata = res;
          // Filter privileges for '104' service as per legacy logic
          const privileges104 = res.previlegeObj.filter((p: any) => p.serviceName === '104');
          this.dataService.userPriveliges = privileges104;
          this.dataService.uid = res.userID;
          this.dataService.agentID = res.agentID;
          this.dataService.uname = this.userID.trim();
          
          this.sessionService.setItem('privilege_flag', res.previlegeObj[0].roles[0].RoleName);
          sessionStorage.setItem('authToken', res.key);
          
          if (res.Status === "New") {
            this.router.navigate(['/set-questions']);
          } else {
            this.router.navigate(['/role-selection']); 
          }
        } else {
          this.loginResult.set("User doesn't have privilege to access 104");
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.loginResult.set(err.errorMessage || 'Internal issue please try after some time');
      }
    });
  }

  ngOnDestroy() {}
}
