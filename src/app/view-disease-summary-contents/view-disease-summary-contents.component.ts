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


import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ConfirmationDialogsService } from './../services/dialog/confirmation.service';
import { HttpServices } from "../services/http-services/http_services.service";
import { SetLanguageComponent } from 'app/set-language.component';

@Component({
  selector: 'app-view-disease-summary-contents',
  templateUrl: './view-disease-summary-contents.component.html',
  styleUrls: ['./view-disease-summary-contents.component.css']
})
export class ViewDiseaseSummaryContentsComponent implements OnInit {

  showData: any = [];
  currentLanguageSet: any;
  constructor(@Inject(MD_DIALOG_DATA) public input: any,
    private dialogRef: MdDialogRef<ViewDiseaseSummaryContentsComponent>,
    private confirmationDialogsService: ConfirmationDialogsService,
    public HttpServices: HttpServices) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.assignSelectedLanguage();
    console.log(this.input, "this.input");
    this.showContents(this.input);
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  showContents(inputData) {
    this.showData = inputData.summaryDetails;
  }
  remove(data) {
    this.confirmationDialogsService.confirm('info', this.currentLanguageSet.areYouSureWantToRemove).subscribe((res) => {
      if (res) {
        const index = this.input.summaryDetails.indexOf(data);
        if (index >= 0) {
          this.input.summaryDetails.splice(index, 1);
        }
        if (this.input.summaryDetails.length == 0) {
          this.closeDialog();
        }

      }
    })
  }
  closeDialog() {
    this.dialogRef.close(this.input.summaryDetails);
  }
}
