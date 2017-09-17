/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
import { Link } from 'react-router';
import BreadCrumbComponent from '../breadCrumb/breadCrumbComponent';

export default class ManageSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AppBaseURLValue: '',
      AppFolderPathValue: '',
      AppStoreURLValue: ''
    };

    this.onChange = this.onChange.bind(this);
    this.setDefault = this.setDefault.bind(this);
    this.getDefaultSettings = this.getDefaultSettings.bind(this);
  }

  componentWillMount() {
    this.getDefaultSettings();
  }

  settingsData () {
    const applicationDistribution = location.href.split('/')[3];
    const settingsURL = `/${applicationDistribution}/ws/rest/owa/settings`; 
    global.$ = require('jquery');
    
    const data =  $ .ajax({
      type: "GET",
      url: settingsURL,
      dataType: "xml",
      async: false
    }).responseText;

    const parser = require('xml2js').parseString;
    let jsonData;

    parser(data, function(err, result){
      jsonData = result;
    });

    try {
      return jsonData.list["org.openmrs.GlobalProperty"];
    } catch(e) {
      if(e instanceof TypeError) {
        e;
      }
    }
  }

  getDefaultSettings () {
    const settingsPaths = this.settingsData();
    const appFolderPath = String.raw`appdata\owa`;
    this.setState({ 
      AppFolderPathValue: settingsPaths != undefined ? settingsPaths[0].propertyValue : appFolderPath,
      AppBaseURLValue: settingsPaths != undefined ? settingsPaths[1].propertyValue : '/owa',
      AppStoreURLValue: settingsPaths != undefined ? settingsPaths[2].propertyValue : 'http://modules.openmrs.org'
    });
  }

  setDefault() {
    event.preventDefault();
    this.getDefaultSettings();
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }
  
  render() {
    let { 
      AppBaseURLValue,
      AppFolderPathValue,
      AppStoreURLValue
    } = this.state;
    return (
      <div>
        <BreadCrumbComponent />
        <div className="container-fluid">
          <form className="form-horizontal">
            <fieldset className="scheduler-border">
              <legend className="scheduler-border">Manage OWA Settings</legend>
              <div className="form-group">
                <label className="control-label col-sm-3" htmlFor="AppBaseURL">App Base URL:</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    id="AppBaseURL"
                    name="AppBaseURLValue"
                    onChange={this.onChange}
                    value={AppBaseURLValue}
                    placeholder="The base URL from where the Open Web Apps are hosted" />
                  {AppBaseURLValue && <h6>The base URL from where the Open Web Apps are hosted</h6>}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3" htmlFor="AppFolderPath">App Folder Path:</label>
                <div className="col-sm-8"> 
                  <input
                    type="text"
                    className="form-control"
                    id="AppFolderPath"
                    name="AppFolderPathValue"
                    onChange={this.onChange}
                    value={AppFolderPathValue}
                    placeholder="The default location where the apps are stored on disk" />
                  {AppFolderPathValue && <h6>The default location where the apps are stored on disk</h6>}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3" htmlFor="AppStoreURL">App Store URL:</label>
                <div className="col-sm-8"> 
                  <input
                    type="text"
                    className="form-control"
                    id="AppStoreURL"
                    name="AppStoreURLValue"
                    onChange={this.onChange}
                    value={AppStoreURLValue}
                    placeholder="The default URL for the OpenMRS appstore" />
                  {AppStoreURLValue && <h6>The default URL for the OpenMRS appstore</h6>}
                </div>
              </div>
              <div className="form-group"> 
                <div className="col-sm-offset-3 col-sm-9">
                  <div className="btn-toolbar">
                    <button 
                      className="btn btn-success save-button"
                      onClick={this.setDefault}
                    >Save</button>
                    <Link to="/">
                      <button 
                        className="btn btn-default"
                      >Cancel</button>
                    </Link>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

