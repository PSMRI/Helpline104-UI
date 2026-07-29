import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CallStateService {
    callData: any = {};
    callTypeID: any;
    callID: any;
    inOutBound: any;
    outboundBenID: any;
    outboundCallReqID: any;
    sio_outbond_providerlist: any = {};
    outboundBloodReqtID: any;
    outboundRequestID: any;
    closeCallerCount: number = 0;
    apiCalledForInbound = false;
    setUniqueCallIDForInBound: Boolean = false;
    setUniqueCallIDForOutbound: Boolean = false;

    callDisconnected = new Subject();
}
