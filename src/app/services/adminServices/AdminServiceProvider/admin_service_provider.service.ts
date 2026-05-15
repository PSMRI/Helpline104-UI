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


import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from "../../config/config.service";
import { SecurityInterceptedHttp } from '../../../http.securityinterceptor';

@Injectable()
export class SPService{
    _adminAPIUrl = this._config.getAdminBaseURL();
    test=[];

     private _geturl: string = this._adminAPIUrl+"getprovider";
    //  private _geturl: string = "http://localhost:8080/adminAPI/getprovider";
     private _saveurl: string = this._adminAPIUrl+"saveprovider";
     private _deleteurl:string=this._adminAPIUrl+"Delete"
     private _updateurl:string=this._adminAPIUrl+"UpdateServiceProvider"
    //private _url:string="http://10.152.3.152:1040/Admin1.1/iEMR/Admin/userAuthenticate/test/sinu"
     //private _url:string="./app/providerdata.json"
    constructor(private _http:SecurityInterceptedHttp,private _config: ConfigService){}
    getProviders(){
        
        return this._http.post(this._geturl, {});
        
    }
    saveProviders(data:any){

        //console.log(data);
        return this._http.post(this._saveurl, data);
        
    }
    
    deleteProviders(request:any){
        return this._http.post(this._deleteurl, request);
    }

    updateProviders(req:any){
        return this._http.post(this._deleteurl, req);
    }
}