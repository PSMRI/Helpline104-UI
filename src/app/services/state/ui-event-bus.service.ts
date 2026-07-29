import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UiEventBusService {
    providerID: any;
    providerServiceMapID: any;
    screeningService_selected: any;
    avoidingEvent: boolean = false;
    transactionId: any;
    feedbackStatusID = 2;
    service_providerID: any;
    healthcareTypeID: any;

    sendBMI = new Subject();
    sendHeaderStatus = new Subject();
    isSelf = new Subject();
    isEmergency = new Subject();
    serviceAvailed = new Subject();
    sendRoutine = new Subject();
}
