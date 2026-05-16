import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class BeneficiaryStateService {
    benData: any;
    benCallID: any;
    beneficiaryData: any = {};
    beneficiaryDetails: any;
    beneficiaryDataAcrossApp: any = {};
    benRegID: any;
    ph: any = "";
    benHealthID: any;
    firstName: any;
    lastName: any;
    age: any;
    gender: any;
    districtID: any;
    blockID: any;
    ben_gender_name: any;
    dummyPh: any;
    caste: any;
    educationID: any;
    benDataInRO: any;

    isBenDetails: any = "";
    isBenDetailsData = new BehaviorSubject(this.isBenDetails);
    isBenDetails$ = this.isBenDetailsData.asObservable();

    getBenDetailsOfCall(value: any) {
        this.isBenDetails = value;
        this.isBenDetailsData.next(this.isBenDetails);
    }

    clearBenData() {
        this.isBenDetails = null;
        this.isBenDetailsData.next(this.isBenDetails);
    }
}
