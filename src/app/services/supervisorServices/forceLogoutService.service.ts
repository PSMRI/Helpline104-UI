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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor'
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
@Injectable()
export class ForceLogoutService {

    commonBaseURL: any;
    force_logout_url: any;
    agent_force_logout_url:any

    constructor(private _http: SecurityInterceptedHttp,
        private _config: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.commonBaseURL = this._config.getCommonBaseURL();
        this.force_logout_url = this.commonBaseURL + 'user/forceLogout';
        this.agent_force_logout_url = this.commonBaseURL + 'user/userForceLogout';
    }

    forcelogout(requestObject) {
        return this.httpIntercept.post(this.force_logout_url, requestObject)
            .map(this.handleSuccess).catch(this.handleError);
    }

    agentForceLogout(reqObj) {
        return this.httpIntercept.post(this.agent_force_logout_url, reqObj)
            .map(this.handleSuccess).catch(this.handleError);
    }


    handleSuccess(response: any) {
        if (response.data) {
            return response.data;
        } else {
            return Observable.throw(response);
        }
    }

    private handleError(error: any) {
        return Observable.throw(error);
    };

}
