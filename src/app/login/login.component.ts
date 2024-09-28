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


import { Component, OnInit } from "@angular/core";
import { loginService } from "../services/loginService/login.service";
import { dataService } from "../services/dataService/data.service";
import { Router } from "@angular/router";
import { ConfirmationDialogsService } from "./../services/dialog/confirmation.service";
import { CzentrixServices } from "../services/czentrix/czentrix.service";
import { PlatformLocation } from "@angular/common";
import { SocketService } from "../services/socketService/socket.service";
import { Subscription } from "rxjs";
import { InterceptedHttp } from "app/http.interceptor";
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: "login-component",
  templateUrl: "./login.html",
  styleUrls: ["./login.component.css"],
})
export class loginContentClass implements OnInit {
  model: any = {};
  userID: any;
  password: any;
  public loginResult: string;
  key: any;
  iv: any;
  SALT: string = "RandomInitVector";
  Key_IV: string = "Piramal12Piramal";
  encPassword: string;
  _keySize: any;
  _ivSize: any;
  _iterationCount: any;
  logoutUserFromPreviousSessionSubscription: Subscription;
  encryptpassword: any;

  constructor(
    public loginservice: loginService,
    public router: Router,
    public dataSettingService: dataService,
    private alertMessage: ConfirmationDialogsService,
    location: PlatformLocation,
    private czentrixServices: CzentrixServices,
    private socketService: SocketService,
    private httpService: InterceptedHttp
  ) {
    location.onPopState((e: any) => {
    });
    this._keySize = 256;
      this._ivSize = 128;
      this._iterationCount = 1989;
  }

  ngOnInit() {
    /*
      Purpose - If user already logged in , kick the prev session and create a new session
      */
    this.httpService.dologoutUsrFromPreSession(false);
    this.logoutUserFromPreviousSessionSubscription =
      this.httpService.logoutUserFromPreviousSessions$.subscribe(
        (logoutUser) => {
          if (logoutUser) {
            this.loginUser(true);
          }
        }
      );
    if (sessionStorage.getItem("authToken")) {
      this.loginservice.checkAuthorisedUser().subscribe(
        (response) => {
          this.dataSettingService.Userdata = response;

          let previlageObj: any = [];
          previlageObj = response.previlegeObj.filter((previlage) => {
            return previlage.serviceName == "104";
          });
          this.dataSettingService.userPriveliges = previlageObj;

          // this.dataSettingService.userPriveliges = response.previlegeObj;
          this.dataSettingService.uid = response.userID;
          this.dataSettingService.agentID = response.agentID;
          // this.dataSettingService.current_serviceID=response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.m_ServiceMaster.serviceID;

          this.dataSettingService.service_providerID =
            response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceProviderID;
          this.dataSettingService.providerID =
            response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceProviderID; //17nov
          this.dataSettingService.uname = this.userID
            ? this.userID.trim()
            : null;
          if (
            response.isAuthenticated === true &&
            response.Status === "Active"
          ) {
            sessionStorage.removeItem("onCall");
            sessionStorage.removeItem("CLI");
            this.dataSettingService.current_campaign = undefined;
            this.router.navigate(["/MultiRoleScreenComponent"], {
              skipLocationChange: true,
            });
          }
          if (response.isAuthenticated === true && response.Status === "New") {
            this.router.navigate(["/setQuestions"]);
          }
        },
        (err) => {}
      );
    }

    this.czentrixServices
      .agentLogout(this.dataSettingService.agentID, "")
      .subscribe(
        (res) => {},
        (err) => {
          //   this.alertMessage.alert(err.errorMessage, 'error');
        }
      );
  }

  get keySize() {
    return this._keySize;
  }

  set keySize(value) {
    this._keySize = value;
  }



  get iterationCount() {
    return this._iterationCount;
  }



  set iterationCount(value) {
    this._iterationCount = value;
  }



  generateKey(salt, passPhrase) {
    return CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
      hasher: CryptoJS.algo.SHA512,
      keySize: this.keySize / 32,
      iterations: this._iterationCount
    })
  }



  encryptWithIvSalt(salt, iv, passPhrase, plainText) {
    let key = this.generateKey(salt, passPhrase);
    let encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: CryptoJS.enc.Hex.parse(iv)
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  encrypt(passPhrase, plainText) {
    let iv = CryptoJS.lib.WordArray.random(this._ivSize / 8).toString(CryptoJS.enc.Hex);
    let salt = CryptoJS.lib.WordArray.random(this.keySize / 8).toString(CryptoJS.enc.Hex);
    let ciphertext = this.encryptWithIvSalt(salt, iv, passPhrase, plainText);
    return salt + iv + ciphertext;
  }


  login(doLogOut) {
    
    bcrypt.hash(this.password, 12, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
      } else {
        this.encryptpassword = hashedPassword;
    this.loginservice
      .authenticateUser(this.userID, this.encryptpassword, doLogOut)
      .subscribe(
        (response: any) => {
          if (
            response !== undefined &&
            response !== null &&
            response.previlegeObj !== undefined &&
            response.previlegeObj !== null
          ) {
            this.successCallback(response);
          }
        },
        (error: any) => this.errorCallback(error)
        );
      }
    });
  }

  loginUser(doLogOut) {
    this.loginservice
    .userLogOutFromPreviousSession(this.userID)
    .subscribe(
      (userLogOutRes: any) => {
      if(userLogOutRes && userLogOutRes.response) {
        bcrypt.hash(this.password, 12, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
          } else {
            this.encryptpassword = hashedPassword;
    this.loginservice
      .authenticateUser(this.userID, this.encryptpassword, doLogOut)
      .subscribe(
        (response: any) => {
          if (
            response !== undefined &&
            response !== null &&
            response.previlegeObj !== undefined &&
            response.previlegeObj !== null
          ) {
            this.successCallback(response);
          }
        },
        (error: any) => this.errorCallback(error)
      );
      }
    });
  }
      else
      {
            this.alertMessage.alert(userLogOutRes.errorMessage, 'error');
      }
      });
  }


  privleges: any;
  successCallback(response: any) {
    sessionStorage.setItem(
      "privilege_flag",
      response.previlegeObj[0].roles[0].RoleName
    );
    console.log("Previlege Role" + response.previlegeObj[0].roles[0].RoleName);
    console.log(JSON.stringify(response));
    console.log(
      response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0]
        .providerServiceMapping.serviceProviderID,
      "login response"
    );

    this.privleges = response.previlegeObj.filter((userPrivelige) => {
      console.log("userPrivelige.serviceName", userPrivelige);
      if (
        userPrivelige &&
        userPrivelige.serviceName &&
        userPrivelige.serviceName != undefined
      )
        return userPrivelige.serviceName == "104";
    });
    if (this.privleges.length > 0) {
      this.dataSettingService.Userdata = response;

      let previlageObj: any = [];
      previlageObj = response.previlegeObj.filter((previlage) => {
        return previlage.serviceName == "104";
      });
      this.dataSettingService.userPriveliges = previlageObj;
      this.dataSettingService.uid = response.userID;
      this.dataSettingService.agentID = response.agentID;

      this.dataSettingService.service_providerID =
        response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceProviderID;
      this.dataSettingService.providerID =
        response.previlegeObj[0].roles[0].serviceRoleScreenMappings[0].providerServiceMapping.serviceProviderID; 

      this.dataSettingService.uname = this.userID ? this.userID.trim() : null;
      console.log("array" + JSON.stringify(response.Previlege));
      console.log("priv after filter" + JSON.stringify(previlageObj));
      console.log(
        "priv in datasetting " +
          JSON.stringify(this.dataSettingService.userPriveliges)
      );

      if (response.isAuthenticated === true && response.Status === "Active") {
        this.dataSettingService.current_campaign = undefined;
        sessionStorage.setItem("key", "pass1234");
        sessionStorage.setItem("authToken", response.key);
        sessionStorage.removeItem("onCall");
        sessionStorage.removeItem("CLI");
        this.czentrixServices
          .getCTILoginToken(this.userID, this.password)
          .subscribe(
            (response) => {
              this.dataSettingService.loginKey = response.login_key;
              console.log("loginKey: " + this.dataSettingService.loginKey);
            },
            (err) => {
              //this.alertMessage.alert(err.errorMessage, 'error');
            }
          );

        this.router.navigate(["/MultiRoleScreenComponent"], {
          skipLocationChange: true,
        });
      }
      if (response.isAuthenticated === true && response.Status === "New") {
        sessionStorage.setItem("key", "pass1234");
        sessionStorage.setItem("authToken", response.key);
        sessionStorage.removeItem("onCall");
        sessionStorage.removeItem("CLI");
        this.router.navigate(["/setQuestions"]);
      }
    } else {
      console.log("checked for 104");
      this.alertMessage.alert(
        "User doesn't have privilege to access 104",
        "error"
      );
    }
  }
  errorCallback(error: any) {
    if (error.status) {
      this.loginResult = error.errorMessage;
    } else {
      this.loginResult = "Internal issue please try after some time";
    }
    console.log(error);
  }

  getLoginKey(userId, password) {
    this.czentrixServices.getLoginKey(userId, password).subscribe(
      (response) => {
        this.dataSettingService.loginKey = response.login_key;
      },
      (err) => {
        //this.alertMessage.alert(err.errorMessage, 'error');
      }
    );
  }

  dynamictype: any = "password";
  showPWD() {
    this.dynamictype = "text";
  }

  hidePWD() {
    this.dynamictype = "password";
  }
  
ngOnDestroy() {
  if (this.logoutUserFromPreviousSessionSubscription) {
    this.logoutUserFromPreviousSessionSubscription.unsubscribe();
  }
}
}
