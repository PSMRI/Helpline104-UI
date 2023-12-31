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


import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notificationService/notification-service';
import { dataService } from '../services/dataService/data.service';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { UtilityService } from '../services/common/utility.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-supervisor-location-communication',
  templateUrl: './supervisor-location-communication.component.html',
  styleUrls: ['./supervisor-location-communication.component.css']
})
export class SupervisorLocationCommunicationComponent implements OnInit {
  
  currentLanguageSet: any;

  searchMode: boolean = true;
  editMode: boolean = false;
  createMode: boolean = false;

  serviceProviderID: any;
  providerServiceMapID: any;

  serviceID: any;
  stateID: any;
  createdBy: any;

  minDate: Date = new Date();


  location_communication_typeID: any;

  // arrays
  offices:Array<any> = [];
  allOfficeIDs:Array<any> = [];
  location_messages:Array<any> = [];

  searchStartDate: Date;
  searchEndDate: Date;
  currentDate: Date = new Date();

  @ViewChild('notificationCreationForm') notificationCreationForm: NgForm;


  constructor(public notification_service: NotificationService,
    public commonDataService: dataService,
    public dialogService: ConfirmationDialogsService,
    public utilityService: UtilityService,
    public HttpServices: HttpServices) { }
    
  ngOnInit() {
    this.assignSelectedLanguage();

    this.providerServiceMapID = this.commonDataService.current_service.serviceID;
    this.createdBy = this.commonDataService.Userdata.userName;
    this.getServiceProviderID(this.providerServiceMapID);
    this.getAllNotificationTypes(this.providerServiceMapID);

    this.minDate.setHours(0);
    this.minDate.setMinutes(0);
    this.minDate.setSeconds(0);
    this.minDate.setMilliseconds(0);

    // this.currentDate.setHours(0);
    // this.currentDate.setMinutes(0);
    // this.currentDate.setSeconds(0);
    // this.currentDate.setMilliseconds(0);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  blockey(e: any) {
    if (e.keyCode === 9) {
      return true;
    } else {
      return false;
    }
  }

  sdChange(sd) {
    sd.setHours(0, 0, 0, 0);
  }

  edChange(ed) {
    ed.setHours(23, 59, 59, 0);
  }

  end_date_min_val: Date;
  calculateEndDateMinValue(start_Date) {
    this.end_date_min_val = start_Date;
    this.end_date_min_val.setHours(0);
    this.end_date_min_val.setMinutes(0);
    this.end_date_min_val.setSeconds(0);
    this.end_date_min_val.setMilliseconds(0);
  }

  getServiceProviderID(providerServiceMapID) {
    this.notification_service.getServiceProviderID(providerServiceMapID)
      .subscribe(response => this.getServiceProviserIDSuccessHandeler(response),
      err => this.handleError(err));
  }

  getServiceProviserIDSuccessHandeler(response) {
    this.serviceProviderID = response.serviceProviderID;
    this.serviceID = response.serviceID;
    this.stateID = response.stateID;
    this.getOffices(this.serviceProviderID, this.stateID, this.serviceID);
  }

  handleError(error) {
    this.dialogService.alert(this.currentLanguageSet.errorEncountered, 'error');
  }

  getAllNotificationTypes(providerServiceMapID) {
    this.notification_service.getNotificationTypes(providerServiceMapID)
      .subscribe(response => this.getAllNotificationTypesSuccessHandeler(response),
      err => this.handleError(err));
  }

  getAllNotificationTypesSuccessHandeler(response) {
    console.log("notification types", response);
    if (response.length == 0) {
      this.dialogService.alert(this.currentLanguageSet.noNotificationTypesFoundContactAdmin);
    }
    else {
      for (var k = 0; k < response.length; k++) {
        if (response[k].notificationType.toUpperCase() === "Location Message".toUpperCase()) {
          this.location_communication_typeID = response[k].notificationTypeID;
          break;
        }
      }
    }
  }

  getOffices(providerID, stateID, serviceID) {
    this.notification_service.getOffices2(this.providerServiceMapID).subscribe(response => this.getOfficesSuccessHandeler(response));
  }

  getOfficesSuccessHandeler(response) {
    console.log(response, "offices");
    if (response.length != 0) {
      this.offices = response;
      for (var i = 0; i < this.offices.length; i++) {
        this.allOfficeIDs.push(this.offices[i].pSAddMapID);
      }
    }
    else {
      this.dialogService.alert(this.currentLanguageSet.noWorkLocationsFound)
    }
  }

  getNotifications(form_values) {
    let startDate: Date = new Date(form_values.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0)

    let endDate: Date = new Date(form_values.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    let obj = {
      "providerServiceMapID": this.providerServiceMapID,
      "notificationTypeID": this.location_communication_typeID,
      "workingLocationIDs": this.allOfficeIDs,
      "validStartDate": startDate,
      "validEndDate": endDate
    };

    this.notification_service.getSupervisorNotifications(obj)
      .subscribe((response) => {
        if (response.length != 0) {
          this.location_messages = response.data;
        }
        else {
          this.dialogService.alert(this.currentLanguageSet.noLocationSpecificMessages);
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(error, 'error');
      });
  }
  updateTimeOffset(date: any) {
    date = new Date(date.valueOf() - 1 * date.getTimezoneOffset() * 60 * 1000);
    return date;
  }
  createLanguageMessage(form_values) {
    let request_array = [];

    let startDate: Date = new Date(form_values.startDate);
    //startDate.setHours(0);
    startDate.setHours(0, 0, 0, 0);
    startDate = this.updateTimeOffset(startDate);
    // startDate.setMinutes(0);
    // startDate.setSeconds(0);
    // startDate.setMilliseconds(0);

    let endDate: Date = new Date(form_values.endDate);
    //endDate.setHours(23);
    // endDate.setMinutes(59);
    // endDate.setSeconds(59);
    // endDate.setMilliseconds(0);
    endDate.setHours(23, 59, 59, 0);
    endDate = this.updateTimeOffset(endDate);

    let workingLocationIDs = undefined;
    workingLocationIDs = (form_values.offices == "") ? workingLocationIDs : form_values.offices;

    let roomArray = [];

    if (workingLocationIDs.length > 0) {
      for (var i = 0; i < workingLocationIDs.length; i++) {

        let defaultObj = {
          "providerServiceMapID": this.providerServiceMapID,
          "notificationTypeID": this.location_communication_typeID,
          "createdBy": this.createdBy,
          "notification": form_values.subject ? form_values.subject.trim() : null,
          "notificationDesc": form_values.message ? form_values.message.trim() : null,
          "validFrom": startDate,
          "validTill": endDate,
          "workingLocationID": workingLocationIDs[i]
        };

        roomArray.push(this.providerServiceMapID + "_" + workingLocationIDs[i].toString());

        request_array.push(defaultObj);
      }
    }

    this.notification_service.createNotification(request_array)
      .subscribe(response => {
        console.log(response.data, "Location Message created");
        if (response.data.length > 0) {
          this.dialogService.alert(this.currentLanguageSet.locationMessageCreatedSuccessfully, 'success');
          this.notificationCreationForm.reset();
          // if (startDate.getTime() <= this.currentDate.getTime()) {
          //   this.notification_service.sendSocketNotification({
          //     "room": roomArray, type: "Location_Message", "message": form_values.message, "subject": form_values.subject
          //   })
          //     .subscribe((response) => {
          //       console.log(response.data);
          //     },
          //     (error) => {
          //       console.log(error);
          //     });
          // }
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(this.currentLanguageSet.locationMessageCreationFailedContactBackendTeam, 'error');
      });
  }

  editType: any;
  notification_subject: any;
  description: any;
  sdate: Date;
  edate: Date;

  editRequestObj: any;

  edit(toBeEditedOBJ) {
    this.editRequestObj = toBeEditedOBJ;
    console.log("TO BE EDITED OBJ", toBeEditedOBJ);
    this.searchMode = false;
    this.createMode = false;
    this.editMode = true;

    this.editType = toBeEditedOBJ.notificationType.notificationType;

    this.notification_subject = toBeEditedOBJ.notification;
    this.description = toBeEditedOBJ.notificationDesc;
    this.sdate = this.utilityService.transformDatetoUTC(toBeEditedOBJ.validFrom);
    this.edate = this.utilityService.transformDatetoUTC(toBeEditedOBJ.validTill);


  }

  editLocationMessage(form_values) {
    console.log("to be edited values", form_values);

    let startDate: Date = new Date(form_values.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);

    let endDate: Date = new Date(form_values.endDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    if (endDate > startDate) {
      let obj = {
        "providerServiceMapID": this.providerServiceMapID,
        "notificationTypeID": this.editRequestObj.notificationTypeID,
        "notificationID": this.editRequestObj.notificationID,
        "notification": form_values.subject ? form_values.subject.trim() : null,
        "notificationDesc": form_values.message ? form_values.message.trim() : null,
        "validFrom": startDate,
        "validTill": endDate,
        "deleted": this.editRequestObj.deleted,
        "modifiedBy": this.createdBy
      }

      this.notification_service.updateNotification(obj).subscribe(response => this.updateSuccess(response), err => this.notificationError(err));
    }
    else {
      this.dialogService.alert(this.currentLanguageSet.validTillShouldBeAFutureDateThanValidFrom);
      this.edate = undefined;
    }


  }

  updateSuccess(response) {
    console.log(response.data);
    if (response.data) {
      this.showTable();
      this.dialogService.alert(this.editType +" "+ this.currentLanguageSet.editedSuccessfully, 'success');

      this.refreshExistingTable(this.location_communication_typeID, this.searchStartDate, this.searchEndDate);
    }
  }

  notificationError(error) {
    console.log("error", error);
    this.dialogService.alert(this.currentLanguageSet.editFailedContactDbTeam, 'error')
  }

  refreshExistingTable(type, startdate, enddate) {
    let startDate: Date = new Date(startdate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0)

    let endDate: Date = new Date(enddate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(0);

    let obj = {
      "providerServiceMapID": this.providerServiceMapID,
      "notificationTypeID": type,
      "workingLocationIDs": this.allOfficeIDs,
      "validStartDate": startDate,
      "validEndDate": endDate
    };

    this.notification_service.getSupervisorNotifications(obj)
      .subscribe((response) => {
        if (response.length != 0) {
          this.location_messages = response.data;
        }
        else {
          this.dialogService.alert(this.currentLanguageSet.noLocationMessages);
        }
      },
      (error) => {
        console.log(error);
        this.dialogService.alert(error, 'error');
      });
  }


  showForm() {
    this.searchMode = false;
    this.editMode = false;
    this.createMode = true;
  }

  showTable() {
    this.searchMode = true;
    this.editMode = false;
    this.createMode = false;
  }

}
