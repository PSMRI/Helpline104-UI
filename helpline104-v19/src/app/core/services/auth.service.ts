import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private sessionService = inject(SessionStorageService);

  private readonly common_url = environment.commonAPI;
  private readonly _agentLogOut = this.common_url + 'cti/doAgentLogout';

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  removeToken() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('apiman_key');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    // Basic implementation, will expand later with full flow
    this.removeToken();
    this.sessionService.clear();
    this.router.navigate(['/login']);
  }
}
