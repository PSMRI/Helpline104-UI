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


import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[appNameWithCopyPaste]",
})
//this directive allows only alphabets
export class AppNameDirectiveWithCopyPaste {
  @HostListener("keypress", ["$event"]) onKeyPress(ev: any) {
    const regex = new RegExp(/^[0-9~!@#$%^&*()_+\-=\[\]{};'`:"\\|,.<>\/?]*$/);
    const key = String.fromCharCode(!ev.charCode ? ev.which : ev.charCode);
    if (regex.test(key)) {
      ev.preventDefault();
    }
  }
  @HostListener("paste", ["$event"]) blockPaste(ev: any,event: KeyboardEvent) {
    let clipboardData =(ev !=undefined) ? ev.clipboardData : undefined;
    let pastedText = (clipboardData !=undefined) ? (clipboardData.getData('text')) : undefined;
    const regex = new RegExp(/^[0-9~!@#$%^&*()_+\-=\[\]{};'`:"\\|,.<>\/?]*$/);
    let flag=false;
    if(pastedText !=null && pastedText != undefined && pastedText.length >0)
    {
      Array.from(pastedText).forEach(element => {
        if (element !=null && element !=undefined && regex.test(element.toString())) {
              flag=true;
            }
      });
    }
    if(flag)
    ev.preventDefault();
} 

}
