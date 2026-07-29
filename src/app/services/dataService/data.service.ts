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
import { AuthContextService } from '../state/auth-context.service';
import { RoleContextService } from '../state/role-context.service';
import { BeneficiaryStateService } from '../state/beneficiary-state.service';
import { CallStateService } from '../state/call-state.service';
import { UiEventBusService } from '../state/ui-event-bus.service';

@Injectable()
export class dataService {
    constructor(
        private auth: AuthContextService,
        private role: RoleContextService,
        private ben: BeneficiaryStateService,
        private call: CallStateService,
        private ui: UiEventBusService
    ) {}

    // Auth
    get Userdata() { return this.auth.Userdata; } set Userdata(v) { this.auth.Userdata = v; }
    get userPriveliges() { return this.auth.userPriveliges; } set userPriveliges(v) { this.auth.userPriveliges = v; }
    get uid() { return this.auth.uid; } set uid(v) { this.auth.uid = v; }
    get uname() { return this.auth.uname; } set uname(v) { this.auth.uname = v; }
    get ipAddress() { return this.auth.ipAddress; } set ipAddress(v) { this.auth.ipAddress = v; }
    get agentID() { return this.auth.agentID; } set agentID(v) { this.auth.agentID = v; }
    get loginKey() { return this.auth.loginKey; } set loginKey(v) { this.auth.loginKey = v; }
    get sessionID() { return this.auth.sessionID; } set sessionID(v) { this.auth.sessionID = v; }

    // Role
    get current_role() { return this.role.current_role; } set current_role(v) { this.role.current_role = v; }
    get current_roleName() { return this.role.current_roleName; } set current_roleName(v) { this.role.current_roleName = v; }
    get current_roleID() { return this.role.current_roleID; } set current_roleID(v) { this.role.current_roleID = v; }
    get current_workingLocationID() { return this.role.current_workingLocationID; } set current_workingLocationID(v) { this.role.current_workingLocationID = v; }
    get current_service() { return this.role.current_service; } set current_service(v) { this.role.current_service = v; }
    get current_serviceID() { return this.role.current_serviceID; } set current_serviceID(v) { this.role.current_serviceID = v; }
    get current_campaign() { return this.role.current_campaign; } set current_campaign(v) { this.role.current_campaign = v; }
    get current_feature() { return this.role.current_feature; } set current_feature(v) { this.role.current_feature = v; }
    get screens() { return this.role.screens; } set screens(v) { this.role.screens = v; }
    get current_stateID_based_on_role() { return this.role.current_stateID_based_on_role; } set current_stateID_based_on_role(v) { this.role.current_stateID_based_on_role = v; }
    get appLanguage() { return this.role.appLanguage; } set appLanguage(v) { this.role.appLanguage = v; }
    get roleSelected() { return this.role.roleSelected; } set roleSelected(v) { this.role.roleSelected = v; }
    get roleChanged() { return this.role.roleChanged; } set roleChanged(v) { this.role.roleChanged = v; }

    // Beneficiary
    get benData() { return this.ben.benData; } set benData(v) { this.ben.benData = v; }
    get benCallID() { return this.ben.benCallID; } set benCallID(v) { this.ben.benCallID = v; }
    get beneficiaryData() { return this.ben.beneficiaryData; } set beneficiaryData(v) { this.ben.beneficiaryData = v; }
    get beneficiaryDetails() { return this.ben.beneficiaryDetails; } set beneficiaryDetails(v) { this.ben.beneficiaryDetails = v; }
    get beneficiaryDataAcrossApp() { return this.ben.beneficiaryDataAcrossApp; } set beneficiaryDataAcrossApp(v) { this.ben.beneficiaryDataAcrossApp = v; }
    get benRegID() { return this.ben.benRegID; } set benRegID(v) { this.ben.benRegID = v; }
    get ph() { return this.ben.ph; } set ph(v) { this.ben.ph = v; }
    get benHealthID() { return this.ben.benHealthID; } set benHealthID(v) { this.ben.benHealthID = v; }
    get firstName() { return this.ben.firstName; } set firstName(v) { this.ben.firstName = v; }
    get lastName() { return this.ben.lastName; } set lastName(v) { this.ben.lastName = v; }
    get age() { return this.ben.age; } set age(v) { this.ben.age = v; }
    get gender() { return this.ben.gender; } set gender(v) { this.ben.gender = v; }
    get districtID() { return this.ben.districtID; } set districtID(v) { this.ben.districtID = v; }
    get blockID() { return this.ben.blockID; } set blockID(v) { this.ben.blockID = v; }
    get ben_gender_name() { return this.ben.ben_gender_name; } set ben_gender_name(v) { this.ben.ben_gender_name = v; }
    get dummyPh() { return this.ben.dummyPh; } set dummyPh(v) { this.ben.dummyPh = v; }
    get caste() { return this.ben.caste; } set caste(v) { this.ben.caste = v; }
    get educationID() { return this.ben.educationID; } set educationID(v) { this.ben.educationID = v; }
    get benDataInRO() { return this.ben.benDataInRO; } set benDataInRO(v) { this.ben.benDataInRO = v; }
    get isBenDetails() { return this.ben.isBenDetails; } set isBenDetails(v) { this.ben.isBenDetails = v; }
    get isBenDetailsData() { return this.ben.isBenDetailsData; } set isBenDetailsData(v) { this.ben.isBenDetailsData = v; }
    get isBenDetails$() { return this.ben.isBenDetails$; } set isBenDetails$(v) { this.ben.isBenDetails$ = v; }
    
    getBenDetailsOfCall(value: any) { this.ben.getBenDetailsOfCall(value); }
    clearBenData() { this.ben.clearBenData(); }

    // Call
    get callData() { return this.call.callData; } set callData(v) { this.call.callData = v; }
    get callTypeID() { return this.call.callTypeID; } set callTypeID(v) { this.call.callTypeID = v; }
    get callID() { return this.call.callID; } set callID(v) { this.call.callID = v; }
    get inOutBound() { return this.call.inOutBound; } set inOutBound(v) { this.call.inOutBound = v; }
    get outboundBenID() { return this.call.outboundBenID; } set outboundBenID(v) { this.call.outboundBenID = v; }
    get outboundCallReqID() { return this.call.outboundCallReqID; } set outboundCallReqID(v) { this.call.outboundCallReqID = v; }
    get sio_outbond_providerlist() { return this.call.sio_outbond_providerlist; } set sio_outbond_providerlist(v) { this.call.sio_outbond_providerlist = v; }
    get outboundBloodReqtID() { return this.call.outboundBloodReqtID; } set outboundBloodReqtID(v) { this.call.outboundBloodReqtID = v; }
    get outboundRequestID() { return this.call.outboundRequestID; } set outboundRequestID(v) { this.call.outboundRequestID = v; }
    get closeCallerCount() { return this.call.closeCallerCount; } set closeCallerCount(v) { this.call.closeCallerCount = v; }
    get apiCalledForInbound() { return this.call.apiCalledForInbound; } set apiCalledForInbound(v) { this.call.apiCalledForInbound = v; }
    get setUniqueCallIDForInBound() { return this.call.setUniqueCallIDForInBound; } set setUniqueCallIDForInBound(v) { this.call.setUniqueCallIDForInBound = v; }
    get setUniqueCallIDForOutbound() { return this.call.setUniqueCallIDForOutbound; } set setUniqueCallIDForOutbound(v) { this.call.setUniqueCallIDForOutbound = v; }
    get callDisconnected() { return this.call.callDisconnected; } set callDisconnected(v) { this.call.callDisconnected = v; }

    // UI Event Bus
    get providerID() { return this.ui.providerID; } set providerID(v) { this.ui.providerID = v; }
    get providerServiceMapID() { return this.ui.providerServiceMapID; } set providerServiceMapID(v) { this.ui.providerServiceMapID = v; }
    get screeningService_selected() { return this.ui.screeningService_selected; } set screeningService_selected(v) { this.ui.screeningService_selected = v; }
    get avoidingEvent() { return this.ui.avoidingEvent; } set avoidingEvent(v) { this.ui.avoidingEvent = v; }
    get transactionId() { return this.ui.transactionId; } set transactionId(v) { this.ui.transactionId = v; }
    get feedbackStatusID() { return this.ui.feedbackStatusID; } set feedbackStatusID(v) { this.ui.feedbackStatusID = v; }
    get service_providerID() { return this.ui.service_providerID; } set service_providerID(v) { this.ui.service_providerID = v; }
    get healthcareTypeID() { return this.ui.healthcareTypeID; } set healthcareTypeID(v) { this.ui.healthcareTypeID = v; }
    get sendBMI() { return this.ui.sendBMI; } set sendBMI(v) { this.ui.sendBMI = v; }
    get sendHeaderStatus() { return this.ui.sendHeaderStatus; } set sendHeaderStatus(v) { this.ui.sendHeaderStatus = v; }
    get isSelf() { return this.ui.isSelf; } set isSelf(v) { this.ui.isSelf = v; }
    get isEmergency() { return this.ui.isEmergency; } set isEmergency(v) { this.ui.isEmergency = v; }
    get serviceAvailed() { return this.ui.serviceAvailed; } set serviceAvailed(v) { this.ui.serviceAvailed = v; }
    get sendRoutine() { return this.ui.sendRoutine; } set sendRoutine(v) { this.ui.sendRoutine = v; }
}
