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
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

const commonIP = 'https://amritwprdev.piramalswasthya.org/';
const IP1097 = 'https://amritwprdev.piramalswasthya.org/';
const telephonyServerIP = 'https://uatcz.piramalswasthya.org/';
const adminIP = 'https://amritwprdev.piramalswasthya.org/';
const IP104 = 'https://amritwprdev.piramalswasthya.org/';
const mmuIP = 'https://amritwprdev.piramalswasthya.org/';
const tmIP = 'https://amritwprdev.piramalswasthya.org/';
const FHIRIP = "https://amritwprdev.piramalswasthya.org";


@Injectable()
export class ConfigService {

    private _helpline1097BaseURL: string = environment.ip1097;
    private _telephonyServerURL: string = environment.telephoneServer;
    private _commonBaseUrlForLicense: string = environment.commonAPI;
    private _commonBaseURL: string = environment.commonAPI;
    private _opencommonBaseURL: string = environment.commonAPI;
    private _helpline104BaseURL: string = environment.ip104;
    private _adminBaseURL: string = environment.adminAPI;
    private _mmuBaseURL: string = environment.adminAPI;
    private _tmBaseURL: string = environment.tmAPI;
    private _fhirBaseURL = environment.fhirAPI;


    public defaultWrapupTime: any = 30;

    getCommonBaseURL() {
        return this._commonBaseURL;
    }
    getCommonBaseURLLicense() {
        return this._commonBaseUrlForLicense;
    }
    getOpenCommonBaseURL() {
        return this._opencommonBaseURL;
    }
    get1097BaseURL() {
        return this._helpline1097BaseURL;
    }
    get104BaseURL() {
        return this._helpline104BaseURL;
    }
    getAdminBaseURL() {
        return this._adminBaseURL;
    }
    getTelephonyServerURL() {
        return this._telephonyServerURL;
    }
    getMMUBaseURL() {
        return this._mmuBaseURL;
    }
    getTMBaseURL() {
        return this._tmBaseURL;
    }
    getFHIRBaseURL() {
        return this._fhirBaseURL;
    }
}
