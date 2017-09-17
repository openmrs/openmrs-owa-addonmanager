/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
import axios from 'axios';
import AddAddon from '../manageApps/AddAddon.jsx';
import DeleteAddonModal from '../manageApps/deleteAddonModal.jsx';
import BreadCrumbComponent from '../../breadCrumb/breadCrumbComponent';
import { ApiHelper } from '../../../helpers/apiHelper';
import { AddonList } from './addonList';

export default class ManageApps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appList: [],
      msgType: 'success',
      showMsg: false,
      staticAppList: [],
      msgBody: '',
      uploadStatus: 0,
      showProgress: false
    };

    this.apiHelper = new ApiHelper(null);
    this.alertMessage = '';

    this.openPage = this.openPage.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleUpload = this.handleUpload.bind(this);  
    this.handleDelete = this.handleDelete.bind(this);  
    this.searchAddOn = this.searchAddOn.bind(this);  
    this.handleProgress = this.handleProgress.bind(this);
    this.handleAlertBehaviour = this.handleAlertBehaviour.bind(this);
  }

  componentWillMount() {
    this.apiHelper.get('/owa/applist').then(response => {
      this.setState((prevState, props) => {
        return {
          appList: response,
          staticAppList: response
        };
      });
    });
  }
  
  componentDidMount() {
    jQuery("#fileInput").filestyle({btnClass: "btn-primary"});
  }

  handleUpload() {
    const applicationDistribution = location.href.split('/')[2];
    const url = location.href.split('/')[3];
    let apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    this.requestUrl ='/owa/addapp';
    let that = this;

    const addonFile = new FormData();
    addonFile.append('file', document.getElementById('fileInput').files[0]);
  
    const response = $.ajax({
      xhr: function(){
        let xhrRequest = $.ajaxSetup().xhr();
        if(xhrRequest.upload){
          xhrRequest.upload.addEventListener('progress',that.handleProgress, false);
        }
        return xhrRequest;
       
      },
      type: "POST",
      url: `https:/${apiBaseUrl}${this.requestUrl}`,
      data: addonFile,
      contentType: false,
      processData: false,
      cache: false,
      success: function (result) {
        this.setState({
          msgBody: "App has been successfully installed",
          msgType: "success",
          showMsg: true,
          appList: result,
          staticAppList: result
        });

        if(that.state.showMsg === true) {
          setTimeout(that.handleAlertBehaviour, 2000);
        }
        
      }.bind(this),
      error: function(xhr, status, error) {
        this.setState({
          msgBody: "App has not been installed",
          msgType: "warning",
          showMsg: true
        });

        if(that.state.showMsg === true) {
          setTimeout(that.handleAlertBehaviour, 2000);
        }
      }.bind(this),
      complete: function(result){
        $(":file").filestyle('clear');
        this.setState({
          uploadStatus: 0,
          showProgress: false,
        });
      }.bind(this)
    });
  }

  handleProgress(e){
    
    if(e.lengthComputable){
      let max = e.total;
      let current = e.loaded;
      
      let Percentage = Math.round((current * 100)/max);   
      this.setState({
        showProgress: true,
        uploadStatus: Percentage
      });
    }
  }

  handleAlertBehaviour() {
    this.setState({
      showMsg: false,
    });
  }

  handleClear() {
    $(":file").filestyle('clear');
  }

  handleDelete(name) {
    const applicationDistribution = location.href.split('/')[3];

    axios.get(`/${applicationDistribution}/module/owa/deleteApp.form?appName=${name}`).then(response => {
      this.setState((prevState, props) => {
        return {
          appList: response.data.appList,
          msgType: 'success' 
        };
      });
    }).catch(error => {
      toastr.error(error);
    });
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
      this.setState({appList: this.state.staticAppList});
    }
  }

  render() {
    const alert = (
      <div className={`col-sm-12 alert alert-${this.state.msgType} alert-dismissable`}>
        <button className="close" data-dismiss="alert" aria-label="close">×</button>
        {this.state.msgBody}
      </div>
    );
    const { showProgress, uploadStatus} = this.state;
    const progressBar = (
      <div className="progress">
        <div className="progress-bar" style={{width: uploadStatus + "%"}} />
        <span>{uploadStatus + "%"} Complete</span>
      </div>
    );

    return (
      <div>
        <BreadCrumbComponent />
        <div className="container-fluid">
          {this.state.showMsg ? alert : null}
          {showProgress === true ? progressBar : null}

          <h3 id="manageApps">Addon Manager</h3>

          <AddAddon 
            handleClear={this.handleClear}
            handleUpload={this.handleUpload}
          />
          <div className="manage-app-table col-sm-12">
            <div className="search-add-on">
              <i className="glyphicon glyphicon-search" />
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
              {this.state.appList.length < 1 ? <tr><th colSpan="5"><h4>No apps found</h4></th></tr>: 
                <AddonList
                  appList={this.state.appList}
                  openPage={this.openPage}
                  handleDelete={this.handleDelete}
                />}
            </table>
          </div>
        </div>
      </div>
    );
  }
}
