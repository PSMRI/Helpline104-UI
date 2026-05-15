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


/*
 * Created by Pankush Manchanda 10,August 2017
 * Http Interceptor to add diffrent function to http request like passing option in every request
 * Advantage : Used to remove the code duplication
 * Migrated from @angular/http to @angular/common/http (HttpClient)
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { LoaderService } from "./services/common/loader.service";
import { Router } from "@angular/router";
import { AuthService } from "./services/authentication/auth.service";
import { ConfirmationDialogsService } from "./services/dialog/confirmation.service";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { SocketService } from "./services/socketService/socket.service";
import { sessionStorageService } from "./services/sessionStorageService/session-storage.service";

@Injectable()
export class InterceptedHttp {
  onlineFlag: boolean = true;
  count = 0;
  dologout: boolean = false;

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private router: Router,
    private authService: AuthService,
    private message: ConfirmationDialogsService,
    private socketService: SocketService,
    private sessionstorage: sessionStorageService,
  ) {}

  get(url: string): Observable<any> {
    let URL = this.updateURL(url);
    if (this.networkCheck()) {
      this.showLoader();
      const headers = this.getHeaders(url);
      return this.http
        .get(URL, { headers })
        .catch(this.onCatch)
        .do(
          (res: any) => {
            this.onSuccess(res);
          },
          (error: any) => {
            this.onError(error);
          }
        )
        .finally(() => {
          this.onEnd();
        });
    } else {
      return Observable.empty();
    }
  }

  post(url: string, body: any): Observable<any> {
    let URL = this.updateURL(url);
    if (this.networkCheck()) {
      this.showLoader();
      const headers = this.getHeaders(url);
      return this.http
        .post(URL, body, { headers })
        .catch(this.onCatch)
        .do(
          (res: any) => {
            this.onSuccess(res);
          },
          (error: any) => {
            this.onError(error);
          }
        )
        .finally(() => {
          this.onEnd();
        });
    } else {
      return Observable.empty();
    }
  }

  put(url: string, body: any): Observable<any> {
    if (this.networkCheck()) {
      const headers = this.getHeaders(url);
      return this.http
        .put(url, body, { headers })
        .catch(this.onCatch)
        .do(
          (res: any) => {
            this.onSuccess(res);
          },
          (error: any) => {
            this.onError(error);
          }
        )
        .finally(() => {
          this.onEnd();
        });
    } else {
      return Observable.empty();
    }
  }

  delete(url: string): Observable<any> {
    if (this.networkCheck()) {
      const headers = this.getHeaders(url);
      return this.http
        .delete(url, { headers })
        .catch(this.onCatch)
        .do(
          (res: any) => {
            this.onSuccess(res);
          },
          (error: any) => {
            this.onError(error);
          }
        )
        .finally(() => {
          this.onEnd();
        });
    } else {
      return Observable.empty();
    }
  }

  private updateURL(url) {
    if (
      sessionStorage.getItem("apiman_key") != undefined &&
      sessionStorage.getItem("apiman_key") != null
    ) 
    {
      url = url + "?apikey=" + sessionStorage.getItem("apiman_key");
      return url;
    } else {
      return url;
    }
  }

  private getHeaders(url?: string): HttpHeaders {
    return new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", this.authService.getToken() || "");
  }

  private onEnd(): void {
    this.hideLoader();
  }
  private onSuccess(response: any) {
    if (response.data) {
      return response;
    } else if (response.statusCode === 5002) {
      if (
        response.errorMessage ===
        "You are already logged in,please confirm to logout from other device and login again"
      ) {
        this.message
          .confirm("info", response.errorMessage)
          .subscribe((confirmResponse) => {
            if (confirmResponse) {
              this.dologoutUsrFromPreSession(true);
            }
          });
      } else {
        sessionStorage.removeItem("key");
        sessionStorage.removeItem("onCall");
        sessionStorage.removeItem("CLI");
        sessionStorage.removeItem("service");
        this.router.navigate([""]);
        this.message.alert(response.errorMessage,"error");
        this.authService.removeToken();
        // this.socketService.logOut();
        return Observable.empty();
      }
    } else {
      throw response;
    }
  }
  private onError(error: any) {
    this.hideLoader();
    const status = error.status;
    if (status === 401 || status === 403) {
            this.message.alert('Your session has expired. Please login again.', 'error');
            this.authService.removeToken();
            sessionStorage.clear();
            this.router.navigate(['']);
            return error;
        }
    return error;
  }
  private showLoader(): void {
    //    console.log('show loader');
    this.loaderService.show();
  }
  private hideLoader(): void {
    //   console.log('Loader hide')
    this.loaderService.hide();
  }
  private onCatch(
    error: any,
    caught?: Observable<any>
  ): Observable<any> {
    return Observable.throw(error);
  }
  private networkCheck(): boolean {
    if (!this.onlineFlag) {
      if (this.count === 0) {
        this.message.alert("You are offline. Please check");
        this.count++;
      }
      return false;
    } else {
      this.count = 0;
      return true;
    }
  }
  /*
    JA354063 - Purpose - If the user didn't log out from the application, directly closed the browser and the same user tried to login
    through diff browser.
    */

  logoutUserFromPreviousSession = new BehaviorSubject(this.dologout);
  logoutUserFromPreviousSessions$ =
    this.logoutUserFromPreviousSession.asObservable();
  dologoutUsrFromPreSession(dologout) {
    this.dologout = dologout;
    this.logoutUserFromPreviousSession.next(dologout);
  }
}