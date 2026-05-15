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

/*
 * DEPRECATED - No longer required.
 * SecurityInterceptedHttp is now a plain @Injectable() service using HttpClient.
 * It is provided directly in app.module.ts providers[] without a factory.
 * This file is kept to avoid breaking imports but exports nothing functional.
 */

export function SecurityFactory() {
  // No-op: SecurityInterceptedHttp is now a regular Injectable, no factory needed.
}
