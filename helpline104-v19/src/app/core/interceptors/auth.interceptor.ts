import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Show loader for all requests
  loaderService.show();

  // Clone request to add headers
  let authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Authorization': authService.getToken() || ''
    }
  });

  // Add apikey from session storage if present
  const apimanKey = sessionStorage.getItem('apiman_key');
  if (apimanKey) {
    authReq = authReq.clone({
      setParams: { apikey: apimanKey }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle session expiry
      if (error.status === 401 || error.status === 403) {
        authService.removeToken();
        sessionStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
    finalize(() => {
      // Hide loader when request completes
      loaderService.hide();
    })
  );
};
