/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
import fetchPolyfill from 'whatwg-fetch';
import AddAddon from '../manageApps/AddAddon.jsx';
import { ApiHelper } from '../../../helpers/apiHelper';
import { AddonList } from './addonList';

export default class ManageApps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appList: [],
      staticAppList: []
    };

    this.openPage = this.openPage.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.searchAddOn = this.searchAddOn.bind(this);  
  }

  componentWillMount() {
    const apiHelper = new ApiHelper(null);
    apiHelper.get('/owa/applist').then(response => {
      if (response.error) throw response.error.message;
      this.setState((prevState, props) => {
        return {
          appList: response,
          staticAppList: response
        };
      });
    });
  }
  
  componentDidMount() {
    $(":file").filestyle({btnClass: "btn-primary"});
  }

  handleUpload() {
    const applicationDistribution = location.href.split('/')[2];
    const url = location.href.split('/')[3];
    let apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    this.requestUrl ='/owa/addapp';

    const addonFile = new FormData();
    addonFile.append('file', document.getElementById('fileInput').files[0]);
    $.ajax({
      type: "POST",
      url: `https:/${apiBaseUrl}${this.requestUrl}`,
      data: addonFile,
      contentType: false,
      processData: false,
      cache: false,
      success: function (result) {                  
        $(":file").filestyle('clear');
      }
    });
  }

  handleClear() {
    $(":file").filestyle('clear');
  }  

  openPage(app) {
    return location.href = `/${location.href.split('/')[3]}/owa/${app.folderName}/${app.launch_path}`;
  }

  searchAddOn(event){
    event.preventDefault();
    if(event.target.value.length >= 1){
      let addOnFound = this.state.appList.filter((app) => app.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1);
      this.setState({appList: addOnFound});
    }else{
      this.setState({appList: this.state.staticAppList})
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <h3 id="manageApps">Addon Manager</h3>
        <AddAddon 
          handleClear={this.handleClear}
          handleUpload={this.handleUpload}
        />
        <div className="manage-app-table col-sm-12">
          <div className="search-add-on">
            <i className="glyphicon glyphicon-search"></i>
            <input type="text" id="search-input" onKeyUp={this.searchAddOn} placeholder="Search for an add on.."/>
          </div>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Developer</th>
                <th>Version</th>
                <th>Delete</th>
              </tr>
            </thead>
            <AddonList appList={this.state.appList} openPage={this.openPage}/>
          </table>
        </div>
      </div>
    );
  }
}
