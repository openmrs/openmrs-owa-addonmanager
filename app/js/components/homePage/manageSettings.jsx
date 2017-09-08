/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';

export default class ManageSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AppBaseURLValue: '',
      AppFolderPathValue: '',
      AppStoreURLValue: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillMount() {
    this.setState({
      AppFolderPathValue: 'appdata/owa',
      AppStoreURLValue: 'http://modules.openmrs.org'
    });
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }
  
  onCancel() {
    event.preventDefault();
    this.setState({ 
      AppBaseURLValue: '',
      AppFolderPathValue: 'appdata/owa',
      AppStoreURLValue: 'http://modules.openmrs.org'
    });
  }

  render() {
    let { 
      AppBaseURLValue,
      AppFolderPathValue,
      AppStoreURLValue
    } = this.state;
    return (
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
                    className="btn btn-success"
                  >Save</button>
                  <button 
                    className="btn btn-default"
                    onClick={this.onCancel}
                  >Cancel</button>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

