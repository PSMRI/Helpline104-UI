import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RoleContextService {
    current_role: any;
    current_roleName: any;
    current_roleID: any;
    current_workingLocationID: any;
    current_service: any;
    current_serviceID: any = 3;
    current_campaign: any;
    current_feature: any;
    screens: any;
    current_stateID_based_on_role: any;
    appLanguage: any = "English";

    roleSelected = new Subject();
    roleChanged = new Subject();
}
