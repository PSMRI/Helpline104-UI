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

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from "../config/config.service";
import { SecurityInterceptedHttp } from '../../http.securityinterceptor';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class CallerService {
    _104baseUrl = this._config.get104BaseURL();
    _commonBaseURL = this._config.getCommonBaseURL();
    _storeCallIDURL = this._104baseUrl + "beneficiary/startCall";
    _setCallHistory = this._104baseUrl + "beneficiary/set/callHistory";
    _getBeneficiaryURL = this._commonBaseURL + "call/beneficiaryByCallID";
    //_getBeneficiaryURL =this._commonBaseURL + "beneficiary/call/getCallHistoryByCallID"; 
    _updateCallerBeneficiaryIDURL = this._104baseUrl + "beneficiary/update/beneficiaryCallID";
    _updateCDICallStatusURL = this._commonBaseURL + "call/updateBeneficiaryCallCDIStatus";
    getWrapupTime = this._104baseUrl + 'user/role/';
    callDetails$: Observable<any>;
    constructor(private _http: SecurityInterceptedHttp, private _config: ConfigService, private httpIntercept: InterceptedHttp) { }
   
    updateCallerBeneficiaryID(data: any) {
        return this._http.post(this._updateCallerBeneficiaryIDURL, data)
            .shareReplay()
            .map(this.extractData)
            .catch(this.handleError);
    }
    setCallHistory(data: any) {
        return this._http.post(this._setCallHistory, data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getBeneficiaryByCallID(data) {
        return this._http.post(this._getBeneficiaryURL, data)
            .shareReplay()
            .map(this.extractData)
            .catch(this.handleError)

        // return this._http.post(this._getBeneficiaryURL, data)
        //     .map(this.extractData)
        //     .catch(this.handleError);
    }

    updateCDIStatus(data) {
        return this.httpIntercept.post(this._updateCDICallStatusURL, data).map(this.extractData).catch(this.handleError);
    }
    getRoleBasedWrapuptime(roleID) {
        return this.httpIntercept.get(this.getWrapupTime + roleID)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(response: any) {
        if (response.data) {
            return response.data;
        } else {
            return Observable.throw(response);
        }
    }
    private handleError(error: any) {
        return Observable.throw(error);
    }
}