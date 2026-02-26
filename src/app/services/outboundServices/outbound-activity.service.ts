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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from "../config/config.service";
import { Observable } from 'rxjs/Observable';
import { InterceptedHttp } from './../../http.interceptor';
import { SecurityInterceptedHttp } from './../../http.securityinterceptor';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class OutboundActivityService {

    _baseurl: String = this._config.get104BaseURL();

    private _saveActivityUrl: string = this._baseurl + "outbound/activity";
    private _getAllActivitiesUrl: string = this._baseurl + "outbound/activities/all";
    private _toggleActivityStatusUrl: string = this._baseurl + "outbound/activity/status";
    private _updateActivityUrl: string = this._baseurl + "outbound/activity/name";
    private _getCallActivityUrl: string = this._baseurl + "outbound/activities";
    private _savecallActivityUrl: string = this._baseurl + "outbound/callDetails/save";
    private _getCallDetailsUrl: string = this._baseurl + "outbound/callDetails/get";

    constructor(
        private _http: SecurityInterceptedHttp,
        private _config: ConfigService,
        private _httpInterceptor: InterceptedHttp
    ) { }

    saveActivity(data: any) {
        return this._httpInterceptor.post(this._saveActivityUrl, data)
            .map(this.extractData).catch(this.handleError);
    }

    getAllActivities() {
        return this._httpInterceptor.get(this._getAllActivitiesUrl)
            .map(this.extractData).catch(this.handleError);
    }

    toggleActivityStatus(data: any) {
        return this._httpInterceptor.put(this._toggleActivityStatusUrl, data)
            .map(this.extractData).catch(this.handleError);
    }

    updateActivity(data: any) {
        return this._httpInterceptor.put(this._updateActivityUrl, data)
            .map(this.extractData).catch(this.handleError);
    }

    getCallActivity(data: any) {
        return this._httpInterceptor.post(this._getCallActivityUrl, data)
            .map(this.extractData).catch(this.handleError);
    }

    saveCallActivity(data: any) {
        return this._httpInterceptor.post(this._savecallActivityUrl, data)
            .map(this.extractData).catch(this.handleError);
    }

    getCallDetails(data: any) {
        return this._httpInterceptor.get(this._getCallDetailsUrl)
            .map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.json().data) {
            return res.json().data;
        } else {
            return res.json();
        }
    };

    private handleError(error: Response | any) {
        return Observable.throw(error.json());
    };
}
