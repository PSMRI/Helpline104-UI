import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  providerID: any;
  providerServiceMapID: any;
  Userdata: any;
  userPriveliges: any;
  uid: any;
  uname: any;
  benData: any;
  ipAddress: any;
  agentID: any;
  loginKey: any;
  benCallID: any;
  current_role: any;
  current_roleName: any;
  current_roleID: any;
  current_workingLocationID: any;
  current_service: any;
  current_serviceID: any = 3;
  current_campaign: any;
  current_feature: any;
  screens: any;
  callData: any = {};
  beneficiaryData: any = {};
  beneficiaryDetails: any;
  sessionID: any;
  sio_outbond_providerlist: any = {};
  screeningService_selected: any;
  beneficiaryDataAcrossApp: any = {};
  benRegID: any;
  ph: any = '';
  benHealthID: any;
  outboundBenID: any;
  outboundCallReqID: any;
  inOutBound: any;
  outboundBloodReqtID: any;
  avoidingEvent: boolean = false;
  transactionId: any;
  isBenDetails: any = '';

  private isBenDetailsData = new BehaviorSubject(this.isBenDetails);
  isBenDetails$ = this.isBenDetailsData.asObservable();

  callTypeID: any;
  feedbackStatusID = 2; // Id for feedback status Open
  service_providerID: any;

  roleSelected = new Subject<any>();
  callDisconnected = new Subject<any>();
  sendBMI = new Subject<any>();
  sendHeaderStatus = new Subject<any>();
  isSelf = new Subject<any>();
  isEmergency = new Subject<any>();
  current_stateID_based_on_role: any;
  firstName: any;
  lastName: any;
  age: any;
  gender: any;
  districtID: any;
  blockID: any;
  ben_gender_name: any;
  dummyPh: any;
  callID: any;
  healthcareTypeID: any;
  serviceAvailed = new Subject<any>();
  sendRoutine = new Subject<any>();
  caste: any;
  educationID: any;
  outboundRequestID: any;

  roleChanged = new Subject<any>();

  closeCallerCount: number = 0;
  setUniqueCallIDForInBound: boolean = false;
  setUniqueCallIDForOutbound: boolean = false;
  benDataInRO: any;
  apiCalledForInbound = false;
  appLanguage: any = "English";

  getBenDetailsOfCall(value: any) {
    this.isBenDetails = value;
    this.isBenDetailsData.next(this.isBenDetails);
  }

  clearBenData() {
    this.isBenDetails = null;
    this.isBenDetailsData.next(this.isBenDetails);
  }
}
