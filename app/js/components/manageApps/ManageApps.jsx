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
import JSZip from 'jszip';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import AddAddon from '../manageApps/AddAddon.jsx';
import BreadCrumbComponent from '../breadCrumb/BreadCrumbComponent.jsx';
import { ApiHelper } from '../../helpers/apiHelper';
import { AddonList } from './AddonList.jsx';
import DeleteAddonModal from './DeleteAddonModal.jsx';
import InvalidZipUploadModal from './InvalidZipUploadModal.jsx';
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
      downloadUri: null,
      deleteStatus: false,
      addonAlreadyInstalled: null,
      files: null,
      displayInvalidZip: false,
    };

    this.apiHelper = new ApiHelper(null);
    this.alertMessage = '';
    this.openPage = this.openPage.bind(this);
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.onlineSearchHandler = this.onlineSearchHandler.bind(this);
    this.handleUploadRequest = this.handleUploadRequest.bind(this);
    this.handleAlertBehaviour = this.handleAlertBehaviour.bind(this);
    this.handleAddonUploadModal = this.handleAddonUploadModal.bind(this);
    this.initiateSearch = this.initiateSearch.bind(this);
    this.displayManageOwaButtons = this.displayManageOwaButtons.bind(this);
  }

  componentWillMount() {
    this.handleApplist();
  }

  componentDidMount() {
    jQuery("#fileInput").filestyle({ btnClass: "btn-primary" });
    $(document).keydown(e => {
      if (e.keyCode == 27) {
        this.hideModal();
      }
    });
  }

  handleDrop(files) {
    if (files.length > 0) {
      this.setState({ files: files });
    } else {
      this.setState({
        msgBody: "File has not been added, please select a valid zip file",
        msgType: "warning",
        showMsg: true,
      });
    }
  }

  handleApplist() {
    const resultData = [];
    this.apiHelper.get('/owa/applist').then(response => {
      response.forEach((data, index) => {
        resultData.push({
          appDetails: data,
          install: false
        });
        if (index === response.length - 1) {
          this.setState((prevState, props) => {
            return {
              appList: resultData,
              staticAppList: resultData
            };
          });
        }
      });
    });
  }

  handleAddonUploadModal(addonName, action, response) {
    swal({
      title: `Are you sure you want to ${action} ${addonName}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((performAction) => {
        if (performAction) {
          swal(`${addonName} addon is ${response}`, {
            icon: 'success',
          });
          this.handleUploadRequest();
        } else {
          this.handleClear();
        }
      });
  }

  handleUpload() {
    const zipedAddon = this.state.files[0];
    const readZippedAddon = new Promise((resolve, reject) => {
      let new_zip = new JSZip();
      new_zip.loadAsync(zipedAddon)
        .then((zip) => {
          return zip.files['manifest.webapp'] ? zip.files['manifest.webapp'] : false;
        })
        .then((file) => {
          return file ? new_zip.file(file.name).async("string") : false;
        })
        .then(result => {
          resolve(JSON.parse(result));
        })
        .catch(e => {
          resolve(false);
        });
    });

    readZippedAddon.then((result) => {
      if (!result) {
        this.setState((prevState, props) => {
          return {
            displayInvalidZip: true
          };
        });
      } else {
        this.setState({
          addonAlreadyInstalled: false,
        });

        this.state.appList.map((addon) => {
          if (addon.name === result.name) {
            this.setState({
              addonAlreadyInstalled: true,
            });
            const toBeInstalledAddonName = result.name;
            const installedAddonVersion = parseInt(addon.version);
            const toBeInstalledAddonVersion = parseInt(result.version);
            if (installedAddonVersion === toBeInstalledAddonVersion) {
              this.handleAddonUploadModal(
                toBeInstalledAddonName,
                'overwrite',
                'overwriting');
            } else if (installedAddonVersion < toBeInstalledAddonVersion) {
              this.handleAddonUploadModal(
                toBeInstalledAddonName,
                'upgrade',
                'upgrading');
            } else {
              this.handleAddonUploadModal(
                toBeInstalledAddonName,
                'downgrade',
                'downgrading');
            }
          }
        });
        this.state.addonAlreadyInstalled === false && this.handleUploadRequest();
      }
    });
  }

  handleUploadRequest() {
    const resultData = [];
    const applicationDistribution = location.href.split('/')[2];
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    this.requestUrl = '/owa/addapp';

    let that = this;
    const zipedAddon = this.state.files[0];

    const addonFile = new FormData();
    addonFile.append('file', zipedAddon);

    let fileName = this.state.files[0].name;
    fileName = fileName.substr(0, fileName.lastIndexOf('.')) || fileName;

    const response = $.ajax({
      xhr: function () {
        let xhrRequest = $.ajaxSetup().xhr();
        if (xhrRequest.upload) {
          xhrRequest.upload.addEventListener('progress', that.handleProgress, false);
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
        resultData.push({
          appList: result,
          downloadUri: null,                  
          install: false
        });
        this.setState((prevState, props) => {
          return {
            showMsg: true,
            msgBody: `${fileName} has been successfully installed`,
            msgType: "success",
            appList: resultData,
            staticAppList: resultData,
          };
        });

      }.bind(this),
      error: function (xhr, status, error) {
        this.setState((prevState, props) => {
          return {
            msgBody: "App has not been installed",
            msgType: "warning",
            showMsg: true
          };
        });
      }.bind(this),
      complete: function (result) {
        this.setState({ files: null });
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

  handleProgress(e) {
    if (e.lengthComputable) {
      let max = e.total;
      let current = e.loaded;

      let Percentage = Math.round((current * 100) / max);
      this.setState((prevState, props) => {
        return {
          showProgress: true,
          uploadStatus: Percentage
        };
      });
    }
  }

  displayManageOwaButtons() {
    if (this.state.files !== null) {
      return (
        <div className="manage-owa-btns">
          <div className="btn-toolbar">
            <button
              id="upload-btn"
              className="btn"
              onClick={this.handleUpload}>
              <span
                className="glyphicon glyphicon-upload"
              /> Upload
            </button>
            <button
              id="clear-btn"
              className="btn"
              onClick={this.handleClear}
            >
              <span className="glyphicon glyphicon-remove" /> Clear
            </button>
          </div>
        </div>
      );
    }
  }

  /**
   * handle delay for alert boxes
   */
  handleAlertBehaviour() {
    this.setState((prevState, props) => {
      return {
        showMsg: false,
      };
    });
  }

  handleClear() {
    let handleClearPromise = new Promise((resolve, reject) => {
      this.setState({
        files: null,
        showMsg: false
      });
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
          msgType: 'warning',
          deleteStatus: false,
          msgBody: `${name} has been successfully deleted.`,
          showMsg: true,
        };
      });
      this.handleApplist();
    }).catch(error => {
      toastr.error(error);
    });
    this.hideModal();
  }

  openModal(app) {
    return (e) => {
      this.setState((prevState, props) => {
        return {
          isOpen: true,
          selectedApp: app
        };
      });
    };
  }

  hideModal() {
    this.setState((prevState, props) => {
      return {
        isOpen: false,
        displayInvalidZip: false
      };
    });
  }

  openPage(app) {
    return location.href = `/${location.href.split('/')[3]}/owa/${app.folderName}/${app.launch_path}`;
  }

  handleDownload(downloadUri) {
    return (e) => {
      e.preventDefault();
      location.href = downloadUri;
    };
  }

  onlineSearchHandler(searchValue) {
    const resultData = [];
    const { staticAppList } = this.state;    
    if (searchValue) {
      axios.get(`https://addons.openmrs.org/api/v1//addon?&q=${searchValue}`)
        .then(response => {
          const searchResults = response.data;
          if (searchResults.length === 0) {
            this.setState({ appList: [] });
          } else {
            const searchResultsPromise = searchResults.map(result => axios.get(
              `https://addons.openmrs.org/api/v1//addon/${result.uid}`
            ));
            Promise.all(searchResultsPromise)
              .then(results => results.forEach((result, index) => {
                resultData.push({
                  appDetails: result.data,
                  downloadUri: result.data['versions'][0] ? result.data['versions'][0].downloadUri: null,
                  install: true             
                });
                if (index === searchResults.length - 1) {
                  this.setState((prevState, props) => {
                    return {             
                      appList: resultData
                    };
                  });
                }
              }))
              .catch(error => {
                if(error) this.setState({ appList: [] });
              });
          }
        })
        .catch(error => {
          if(error) this.setState({ appList: [] });          
        });
    } else {
      this.setState((prevState, props) => {
        return {
          appList: staticAppList
        };
      });
    }
  }

  initiateSearch(event) {
    if (event.keyCode ===  13) {
      const searchValue = event.target.value;      
      this.onlineSearchHandler(searchValue);
    }
  }

  render() {
    const {
      showProgress,
      uploadStatus,
      deleteStatus,
      showMsg,
      msgType,
      msgBody,
      appList,
      isOpen,
      selectedApp,
      displayInvalidZip } = this.state;

    if (showMsg === true) {
      setTimeout(this.handleAlertBehaviour, 6000);
    }

    const alert = (
      <div className={`col-sm-12 alert alert-${msgType} alert-dismissable`}>
        <button className="close" data-dismiss="alert" aria-label="close">×</button>
        {msgBody}
      </div>
    );


    const disableUploadElements = (uploadStatus > 0) ? true : false;
    deleteStatus ? document.body.className = 'loading' : document.body.className = '';
    disableUploadElements ? document.body.className = 'loading' : document.body.className = '';

    return (
      <div>
        <div className="main-home-page" id="body-wrapper">
          <div className="row">
            <div className="col-sm-12">
              <h2 className="manage-addon-title">Add-on Manager</h2>
              <span className="pull-right manage-settings-wrapper">
                <Link to="/manageModules">
                  <button id="manage-modules-btn" className="btn btn-secondary">
                    <span className="glyphicon glyphicon-th-list" />
                      Manage Modules</button>
                </Link>
                <Link to="/manageSettings" className="manage-settings-button">
                  <i className="glyphicon glyphicon-cog settings-icon" id="setting-icon-btn" />
                </Link>
              </span>
            </div>
          </div>

          <div className="home-page-body">
            <div className="container">
              <div id="notification-wrapper">
                {showMsg && alert}
              </div>

              <AddAddon
                files={this.state.files}
                handleDrop={this.handleDrop}
                handleClear={this.handleClear}
                handleUpload={this.handleUpload}
                displayManageOwaButtons={this.displayManageOwaButtons}
              />

              <div className="manage-app-table col-sm-12">
                <div className="search-add-on">
                  <i className="glyphicon glyphicon-search" />
                  <input
                    type="text"
                    id="search-input"
                    onKeyDown={this.initiateSearch}
                    placeholder="Search for add-ons to install or clear field to display installed add-ons" />
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
                  {appList.length < 1 ?
                    <tbody>
                      <tr>
                        <th colSpan="5"><h4>No apps found</h4></th>
                      </tr>
                    </tbody> :
                    <AddonList
                      handleDownload={this.handleDownload}
                      appList={appList}
                      openPage={this.openPage}
                      openModal={this.openModal}
                    />
                  }
                </table>
                {isOpen ? (
                  <DeleteAddonModal
                    app={selectedApp}
                    handleDelete={this.handleDelete}
                    isOpen={isOpen}
                    hideModal={this.hideModal} />
                ) : null}
                {
                  displayInvalidZip && (
                    <InvalidZipUploadModal
                      isOpen={displayInvalidZip}
                      hideModal={this.hideModal}
                    />
                  )}
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
