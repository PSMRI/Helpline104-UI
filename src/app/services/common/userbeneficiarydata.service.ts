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

@Injectable()
export class UserBeneficiaryData
{
    // _commonBaseURL = "http://localhost:9090/CommonV1";
    _commonBaseURL = this._config.getCommonBaseURL();
    _104BaseURL = this._config.get104BaseURL();
    _getUserBeneficaryDataURL = this._commonBaseURL + "beneficiary/getRegistrationDataV1";
    _storeAltNumberURL =  this._104BaseURL + "beneficiary/save/BeneficiaryPhoneNumber";

    constructor( private _http: SecurityInterceptedHttp,private _config: ConfigService ) { }
    getUserBeneficaryData (data)
    {      
        return this._http.post( this._getUserBeneficaryDataURL, data )
            .map( this.extractData )
            .catch( this.handleError );
    }

    storeAlternateNumber(data){
         return this._http.post( this._storeAltNumberURL, data )
            .map( this.extractData )
            .catch( this.handleError );
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