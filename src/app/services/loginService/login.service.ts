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


import { forwardRef, Inject, Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { ConfigService } from "../config/config.service";
import { InterceptedHttp } from "./../../http.interceptor";
import { SecurityInterceptedHttp } from "./../../http.securityinterceptor";

@Injectable()
export class loginService {
  // _baseUrl = this._config.getCommonBaseURL();
  _baseUrl = this._config.getOpenCommonBaseURL();
  _adminUrl = this._config.getAdminBaseURL();
  base104URL = this._config.get104BaseURL();
  _authorisedUser = this._baseUrl + "user/getLoginResponse";
  logoutUserUrl: any;
  transactionId: any;
  getServiceProviderID_url: any;
  apiVersionUrl = this.base104URL + "version";

 
  constructor(
    private http: SecurityInterceptedHttp,
    private _config: ConfigService,
    private httpInter: InterceptedHttp
  ) {
    this.getServiceProviderID_url = this._adminUrl + "getServiceProviderid";
    this.logoutUserUrl = this._baseUrl + "user/userLogout";
  }
  public checkAuthorisedUser() {
    return this.httpInter
      .post(this._authorisedUser, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  public authenticateUser(uname, pwd, doLogout) {
    return this.httpInter
      .post(this._baseUrl + "user/userAuthenticate", {
        userName: uname,
        password: pwd,
        doLogout: doLogout,
      })
      .map(this.extractData)
      .catch(this.handleError);
  };

  public userLogOutFromPreviousSession(uname) {
    return this.httpInter
      .post(this._baseUrl + "user/logOutUserFromConcurrentSession", {
        userName: uname
      })
      .map(this.extractData)
      .catch(this.handleError);
  };

  validateSecurityQuestionAndAnswer(ans: any, uname: any): Observable<any> {
    return this.http
      .post(this._baseUrl + "user/validateSecurityQuestionAndAnswer", {
        SecurityQuesAns: ans,
        userName: uname,
      })
      .map(this.extractDataForSecurity)
      .catch(this.handleError);
  }
  getSecurityQuestions(uname: any): Observable<any> {
    return this.http
      .post(this._baseUrl + "user/forgetPassword", { userName: uname })
      .map(this.extractData)
      .catch(this.handleError);
  }

  getServiceProviderID(providerServiceMapID) {
    return this.http
      .post(this.getServiceProviderID_url, {
        providerServiceMapID: providerServiceMapID,
      })
      .map(this.extractData)
      .catch(this.handleError);
  }

  userLogout() {
    sessionStorage.removeItem("privilege_flag");
    sessionStorage.removeItem("session_id");
    sessionStorage.removeItem("callTransferred");
    return this.httpInter
      .post(this.logoutUserUrl, {})
      .map(this.extractData)
      .catch(this.handleError);
  }
  getApiVersionDetails() {
    return this.httpInter.get(this.apiVersionUrl).map((res) => res.json());
  }
  private extractData(res: Response) {
    if (res.json().data) {
      return res.json().data;
    } else {
      return Observable.throw(res.json());
    }
  }

  private extractDataForSecurity(res: Response) {
    if (res.json().data) {
      return res.json();
    } else {
      return Observable.throw(res.json());
    }
  }

  private handleError(error: Response | any) {
    return Observable.throw(error.json());
  }

 
}
