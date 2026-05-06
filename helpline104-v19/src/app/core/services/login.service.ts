import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private readonly baseUrl = this.config.getOpenCommonBaseURL();
  private readonly authorisedUserUrl = `${this.baseUrl}user/getLoginResponse`;
  private readonly logoutUserUrl = `${this.baseUrl}user/userLogout`;

  checkAuthorisedUser() {
    return this.http.post<any>(this.authorisedUserUrl, {}).pipe(
      map(res => res.data),
      catchError(err => throwError(() => err))
    );
  }

  authenticateUser(uname: string, pwd: string, doLogout: boolean, captchaToken?: string) {
    const body: any = {
      userName: uname,
      password: pwd,
      withCredentials: true,
      doLogout: doLogout,
    };
    if (captchaToken) body.captchaToken = captchaToken;

    return this.http.post<any>(`${this.baseUrl}user/userAuthenticate`, body).pipe(
      map(res => {
        if (res.statusCode && res.statusCode !== 200) {
          throw {
            status: res.statusCode,
            errorMessage: res.errorMessage || 'Unknown error'
          };
        }
        return res.data;
      }),
      catchError(err => {
        const payload = err.errorMessage
          ? err
          : (err.error?.errorMessage ? err.error : { errorMessage: err.message || 'Unknown error' });
        return throwError(() => payload);
      })
    );
  }

  userLogOutFromPreviousSession(uname: string) {
    return this.http.post<any>(`${this.baseUrl}user/logOutUserFromConcurrentSession`, {
      userName: uname
    }).pipe(
      map(res => res.data),
      catchError(err => throwError(() => err))
    );
  }

  userLogout() {
    sessionStorage.removeItem('privilege_flag');
    sessionStorage.removeItem('session_id');
    return this.http.post<any>(this.logoutUserUrl, {}).pipe(
      map(res => res.data),
      catchError(err => throwError(() => err))
    );
  }
}
