/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export default class logger {
  constructor() {
    this.DISPLAY_INFO_LOGS = true;
    this.DISPLAY_INFO_LOGS_STACK = false;
    this.DISPLAY_ERROR_LOGS = true;
    this.DISPLAY_ERROR_LOGS_STACK = false;
    this.DISPLAY_WARN_LOGS = true;
  }
  
  // to print the info logs
  info(message, data) {
    if(this.DISPLAY_INFO_LOGS){
      console.log(message);
    }

    if(typeof(data)!=undefined && this.DISPLAY_INFO_LOGS_STACK){
      if(typeof(data)!=String){
        console.log(JSON.stringify(data));
      }
      else{
        console.log(data);
      }
    }
  }

  // to print the warn logs
  warn(message) {
    if(this.DISPLAY_WARN_LOGS){
      console.warn(message);
    }
  }

  // to print the error logs
  error(message , data) {
    if(this.DISPLAY_ERROR_LOGS){
      console.error(message);
    }

    if(typeof(data)!=undefined && this.DISPLAY_ERROR_LOGS_STACK){
      if(typeof(data)!=String){
        console.error(JSON.stringify(data));
      }
      else{
        console.error(data);
      }
    }
  }
}
