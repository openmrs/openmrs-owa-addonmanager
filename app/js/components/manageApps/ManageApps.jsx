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
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import AddAddon from '../manageApps/AddAddon.jsx';
import BreadCrumbComponent from '../breadCrumb/BreadCrumbComponent.jsx';
import { ApiHelper } from '../../helpers/apiHelper';
import { AddonList } from './AddonList.jsx';
import DeleteAddonModal from './DeleteAddonModal.jsx';
import Utility from './../../utility';

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
      showProgress: false,
      isOpen: false,
      selectedApp: null,
      displayManageOwaButtons: false,
      searchResults: [],
      install: false,
      downloadUri: null,
      deleteStatus: false,
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
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.displayManageOwaButtons = this.displayManageOwaButtons.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.onlineSearchHandler = this.onlineSearchHandler.bind(this);
  }

  componentWillMount() {
    this.handleApplist();
  }
  
  componentDidMount() {
    jQuery("#fileInput").filestyle({btnClass: "btn-primary"});
  }

  handleApplist() {
    this.apiHelper.get('/owa/applist').then(response => {
      this.setState((prevState, props) => {
        return {
          appList: response,
          staticAppList: response
        };
      });
    });
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
        this.setState((prevState, props) => {
          return {
            msgBody: "App has been successfully installed",
            msgType: "success",
            showMsg: true,
            appList: result,
            staticAppList: result,
          };
        });

        if(that.state.showMsg === true) {
          setTimeout(that.handleAlertBehaviour, 2000);
        }

      }.bind(this),
      error: function(xhr, status, error) {
        this.setState((prevState, props) => {
          return {
            msgBody: "App has not been installed",
            msgType: "warning",
            showMsg: true
          };
        });

        if(that.state.showMsg === true) {
          setTimeout(that.handleAlertBehaviour, 2000);
        }
      }.bind(this),
      complete: function(result){
        $(":file").filestyle('clear');
        this.setState((prevState, props) => {
          return {
            uploadStatus: 0,
            showProgress: false,
          };
        });
        this.displayManageOwaButtons();
      }.bind(this)
    });
  }

  handleProgress(e){
    if(e.lengthComputable){
      let max = e.total;
      let current = e.loaded;
      
      let Percentage = Math.round((current * 100)/max);   
      this.setState((prevState, props) => {
        return {
          showProgress: true,
          uploadStatus: Percentage
        };
      });
    }
  }

  displayManageOwaButtons() {
    const addonFile = document.getElementById('fileInput').files[0];
    if (typeof(addonFile) !== 'undefined') {
      this.setState((prevState, props) => {
        return {
          displayManageOwaButtons: true
        };
      });
    } else {
      this.setState((prevState, props) => {
        return {
          displayManageOwaButtons: false
        };
      });
    }
  }

  handleAlertBehaviour() {
    this.setState((prevState, props) => {
      return {
        showMsg: false,
      };
    });
  }

  handleClear() {
    let handleClearPromise = new Promise((resolve, reject) => {
      $(":file").filestyle('clear');
      resolve('Success');
    });
    handleClearPromise.then((response) => {
      if (response === 'Success') {
        this.displayManageOwaButtons();
      }
    });
  }

  handleDelete(name) {
    this.setState((prevState, props) => {
      return {
        deleteStatus: true,
      };
    });
    const applicationDistribution = location.href.split('/')[3];
    axios.get(`/${applicationDistribution}/module/owa/deleteApp.form?appName=${name}`).then(response => {
      this.setState((prevState, props) => {
        return {
          appList: response.data.appList,
          msgType: 'success',
          deleteStatus: false, 
        };
      });
      Utility.notifications('error', name + ' deleted successfully');
      this.handleApplist();
    }).catch(error => {
      toastr.error(error);
    });
    this.hideModal();
  }

  openModal(app){
    return (e) => {
      this.setState((prevState, props) => {
        return {
          isOpen: true,
          selectedApp: app
        };
      });
    };
  }
 
  hideModal(){
    this.setState((prevState, props) => {
      return {
        isOpen: false
      };
    });
  }

  openPage(app) {
    return location.href = `/${location.href.split('/')[3]}/owa/${app.folderName}/${app.launch_path}`;
  }

  handleDownload(e) {
    e.preventDefault();
    location.href=this.state.downloadUri;
  }

  onlineSearchHandler(addOnFound, searchValue, searchResults, staticAppList) {
    if(addOnFound.length > 0) {
      this.setState((prevState, props) => {
        return {
          appList: addOnFound,
          install: false,
          downloadUri: null,
          searchResults: [],        };
      });
    } else if(searchValue.length >1 && addOnFound.length == 0) {
      axios.get(`https://addons.openmrs.org/api/v1//addon?&q=${searchValue}`)
        .then(response => {
          this.setState((prevState, props) => {
            return {
              searchResults: response.data
            };
          });
        })
        .catch(error => {
          error;
        });
      if(searchResults.length < 1) {
        this.setState((prevState, props) => {
          return {
            appList: []
          };
        });
      } else {
        searchResults.forEach(result => {
          if(result.type == "OWA") {
            axios.get(`https://addons.openmrs.org/api/v1//addon/${result.uid}`)
              .then(res => {
                this.setState((prevState, props) => {
                  return {
                    appList: [res.data],
                    downloadUri: res.data['versions'][0].downloadUri,
                    install: true
                  };
                });
              });
          }
        });
      }
    } else {
      this.setState((prevState, props) => {
        return { 
          appList: staticAppList,
          searchResults: []
        };
      });
    }
  }

  searchAddOn(event){
    event.preventDefault();
    const searchValue = event.target.value;
    const { searchResults, staticAppList, appList} = this.state;
    
    let addOnFound = this.state.staticAppList.filter((app) => 
      app.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1
      || app.description.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1 
      || app.developer["name"].toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1 
      || app.version.indexOf(event.target.value) !== -1);

    this.onlineSearchHandler(addOnFound, searchValue, searchResults, staticAppList);

  }

  render() {
    const alert = (
      <div className={`col-sm-12 alert alert-${this.state.msgType} alert-dismissable`}>
        <button className="close" data-dismiss="alert" aria-label="close">×</button>
        {this.state.msgBody}
      </div>
    );
    const {
      showProgress,
      uploadStatus,
      deleteStatus } = this.state;
    const disableUploadElements = (this.state.uploadStatus > 0) ? true : false;
    deleteStatus ? document.body.className = 'loading' : document.body.className = '';
    disableUploadElements ? document.body.className = 'loading' : document.body.className = '';

    return (
      <div>
        <div className="main-home-page" id="body-wrapper">
          <div className="row">
            <div className="col-sm-6">
              <h2>Add-on Manager</h2>
            </div>
            <div className="col-sm-6 manage-settings">
              <div className="pull-right">
                <Link to="/manageSettings" className="manage-settings-button">
                  <i className="glyphicon glyphicon-cog settings-icon" id="icon-btn" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="home-page-body">
            <div className="container-fluid">
              <div id="notification-wrapper">
                {this.state.showMsg && alert}
              </div>

              <AddAddon
                handleClear={this.handleClear}
                handleUpload={this.handleUpload}
                displayManageOwaButtons={this.displayManageOwaButtons}
                displayManageOwaButtonsState={this.state.displayManageOwaButtons}
              />

              <div className="manage-app-table col-sm-12">
                <div className="search-add-on">
                  <i className="glyphicon glyphicon-search" />
                  <input 
                    type="text" 
                    id="search-input" 
                    onKeyUp={this.searchAddOn} 
                    placeholder="Search for an add on.."/>
                </div>
                <table className="table table-bordered table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Logo</th>
                      <th>Name</th>
                      <th>Developer</th>
                      <th>Version</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {this.state.appList.length < 1 ? 
                    <tbody>
                      <tr>
                        <th colSpan="5"><h4>No apps found</h4></th>
                      </tr>
                    </tbody> : 
                    <AddonList
                      handleDownload = {this.handleDownload}
                      install = {this.state.install}
                      appList={this.state.appList}
                      openPage={this.openPage}
                      openModal={this.openModal}
                    />}
                </table>
                {this.state.isOpen ? (
                  <DeleteAddonModal
                    app={this.state.selectedApp}
                    handleDelete={this.handleDelete}
                    isOpen={this.state.isOpen}
                    hideModal={this.hideModal}/>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {deleteStatus ? 
          <div className="deleting-modal"><p className="upload-text">Deleting Addon</p></div>
          : <div className="waiting-modal"><p className="upload-text">Uploading {uploadStatus}%</p></div>}
      </div>
    );
  }
}
