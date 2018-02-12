/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
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
import Loader from 'react-loader';
import { Link } from 'react-router';
import ScrollToTop from 'react-scroll-up';
import PropTypes from 'prop-types';
import { MenuItem, DropdownButton } from 'react-bootstrap';
import _ from 'lodash';

import AddAddon from '../manageApps/AddAddon.jsx';
import { ConfirmationModal } from './ConfirmationModal.jsx';
import { ApiHelper } from '../../helpers/apiHelper';
import { AddonList } from './AddonList.jsx';
import InvalidZipUploadModal from './InvalidZipUploadModal.jsx';


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
      isAdmin: false,
      selectedApp: null,
      downloadUri: null,
      checkUpdates: false,
      addonAlreadyInstalled: null,
      files: null,
      displayInvalidZip: false,
      allowWebAdmin: true,
      searchComplete: false,
      isSearched: false,
      updatesAvailable: null,
      cannotViewAddons : false,
      searchedAddons: [],
      progressMsg: null,
      upgrading: false,
      upgradeAddon: null,
      upgradeVersion: null,
      newAddon: null,
      openUpgradeConfirmation: false,
    };

    this.apiHelper = new ApiHelper(null);
    this.openPage = this.openPage.bind(this);
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleInstall = this.handleInstall.bind(this);
    this.handleUpgrade = this.handleUpgrade.bind(this);
    this.confirmUpgrade = this.confirmUpgrade.bind(this);
    this.dismissUpgradeModal = this.dismissUpgradeModal.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.onlineSearchHandler = this.onlineSearchHandler.bind(this);
    this.handleUploadRequest = this.handleUploadRequest.bind(this);
    this.handleAlertBehaviour = this.handleAlertBehaviour.bind(this);
    this.handleAddonUploadModal = this.handleAddonUploadModal.bind(this);
    this.handleStartModules = this.handleStartModules.bind(this);
    this.initiateSearch = this.initiateSearch.bind(this);
    this.handleOmodUploadRequest = this.handleOmodUploadRequest.bind(this);
    this.displayManageOwaButtons = this.displayManageOwaButtons.bind(this);
    this.checkForUpdates = this.checkForUpdates.bind(this);
    this.clearUpdates = this.clearUpdates.bind(this);
    this.checkIsAdmin = this.checkIsAdmin.bind(this);
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this);
    this.fetchAdminProperties = this.fetchAdminProperties.bind(this);
    this.startAllModules = this.startAllModules.bind(this);
    this.getInstalled = this.getInstalled.bind(this);
    this.sortApplist = this.sortApplist.bind(this);
    this.getInstalledOwa = this.getInstalledOwa.bind(this);
  }

  componentWillMount() {
    this.props.checkLoginStatus();
    this.handleApplist();
    this.checkIsAdmin();
    this.fetchAdminProperties();
  }

  componentDidMount() {
    jQuery("#fileInput").filestyle({ btnClass: "btn-primary" });
    $(document).keydown(e => {
      if (e.keyCode == 27) {
        this.hideModal();
      }
    });
    document.title = "Add On Manager";
  }

  startAllModules() {
    this.setState({
      searchComplete: false
    });
    const applicationDistribution = location.href.split('/')[2];
    const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    const requestUrl = '/v1/moduleaction';
    const postData = {
      "action": "start",
      "allModules": "true",
    };
    axios.post(`${urlPrefix}/${apiBaseUrl}${requestUrl}`, postData).then(response => {
      this.setState({
        msgBody: "All modules started successfully",
        msgType: "success",
        showMsg: true,
        searchComplete: true,
      });
      this.handleApplist();
    }).catch(
      (error) => {
        error.response.status === 401 ?
          location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm`
          : error.response.status === 500 ?
            toastr.error("Some modules failed to start")
            : toastr.error(error);
        this.handleApplist();
      }
    );
  }

  fetchCurrentUser(){
    const apiHelper = new ApiHelper(null);
    const getUserData = new Promise(function(resolve, reject) {
      apiHelper.get('/v1/session').then(response => {
        resolve(response);
      }).catch(error => {
        toastr.error(error.message);
      });
    });
    return getUserData;
  }

  fetchAdminProperties () {
    const applicationDistribution = location.href.split('/')[2];
    const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    const requestUrl = '/owa/allowModuleWebUpload';
    axios.get(`${urlPrefix}/${apiBaseUrl}${requestUrl}`)
      .then(response => {
        this.setState((prevState, props) => {
          return {
            allowWebAdmin : response.data,
          };
        });
      })
      .catch(error => {
        toastr.error(error.message);
      });
  }

  checkIsAdmin() {
    this.fetchCurrentUser().then((response) => {
      if (response.user) {
        const user = response.user;
        let userPrivileges = [];
        let userCanManageModules;
        let userHasPermittedRoles;
        userPrivileges = userPrivileges.concat(user.privileges);
        if (user.roles.length > 0){
          const roles = user.roles;
          const userRoles = roles.find((userRole) => {
            if (userRole.display === "System Developer") {
              return userHasPermittedRoles = true;
            }
            return userHasPermittedRoles = false;
          });
        }
        if (userPrivileges.length > 0) {
          const managePrivilege = userPrivileges.find((managemodules) => {
            if (managemodules.display === "Manage Modules") {
              return userCanManageModules = true;
            }
            return userCanManageModules = false;
          });
        }
        if (userCanManageModules || userHasPermittedRoles){
          this.setState((prevState, props) => {
            return {
              isAdmin : true,
            };
          });
        }
        if (!userCanManageModules && !userHasPermittedRoles){
          this.setState((prevState, props) => {
            return {
              cannotViewAddons : true,
            };
          });
        }
      }
    });
  }

  handleDrop(files) {
    const fileName = files[0].name;
    const fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length - 1).toLowerCase();

    if (fileExtension === 'zip' || fileExtension === 'omod') {
      this.setState({ files: files });
    } else {
      this.setState({
        msgBody: "File has not been added, please select a valid .zip or .omod file",
        msgType: "warning",
        showMsg: true,
      });
    }
  }

  handleApplist() {
    const installedOwas = [];
    let installedModules = [];

    this.apiHelper.get('/owa/applist').then(response => {
      response.forEach((data, index) => {
        installedOwas.push({
          appDetails: data,
          appType: 'owa',
          install: false,
          upgrading: false,
        });
      });

      const installedAddons = installedOwas.concat(installedModules);
      this.setState((prevState, props) => {
        return {
          appList: installedAddons,
          staticAppList: installedAddons,
          searchComplete: false,
        };
      });
    }).then(() => {
      const applicationDistribution = location.href.split('/')[2];
      const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
      const url = location.href.split('/')[3];
      const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
      this.requestUrl = '/v1/module/?v=full';

      axios.get(`${urlPrefix}/${apiBaseUrl}${this.requestUrl}`).then(response => {
        return Promise.all(response.data.results.map(data => {
          return axios.get(`${ApiHelper.getAddonUrl()}?modulePackage=${data.packageName}`)
            .then(response => {
              return Object.assign({}, data, {maintainers: response.data.maintainers});
            }).then(result => {
              installedModules.push({
                appDetails: result,
                appType: 'module',
                install: false
              });
              return result;
            }).catch(error => {
              const installedAddons = this.sortApplist(installedOwas.concat(installedModules));
              this.setState((prevState, nextProps) => ({
                appList: installedAddons,
                staticAppList: installedAddons,
                searchComplete: true
              }));
              return data;
            });
        }));

      }).then(() => {
        const installedAddons = this.sortApplist(installedOwas.concat(installedModules));
        this.setState((prevState, props) => {
          return {
            appList: installedAddons,
            staticAppList: installedAddons,
            searchComplete: true
          };
        });
      });
    });
  }

  sortApplist(list) {
    return _.sortBy(list, [function (object) {
      return object.appDetails.name.toLowerCase();
    }]);
  }

  handleStartModules() {
    this.props.checkLoginStatus();
    const { appList } = this.state;
    const allStartedModules = appList.filter(addon => addon.appDetails.started);
    const appListModules = appList.filter(app => app.appType === "module");
    if (allStartedModules.length === appListModules.length) {
      this.setState({
        msgBody: "All modules are already started",
        msgType: "info",
        showMsg: true,
        searchComplete: true,
      });
    } else {
      this.startAllModules();
    }
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
    this.props.checkLoginStatus();
    const uploadFile = this.state.files[0];
    if (uploadFile.type === 'application/zip') {
      const readZippedAddon = new Promise((resolve, reject) => {
        let new_zip = new JSZip();
        new_zip.loadAsync(uploadFile)
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
              displayInvalidZip: true,
            };
          });
        } else {
          this.setState({
            addonAlreadyInstalled: false,
          });

          this.state.appList.map((addon)=> {
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
          this.state.addonAlreadyInstalled === false&&this.handleUploadRequest();
        }
      });
    } else {
      this.handleOmodUploadRequest();
    }
  }

  handleOmodUploadRequest() {
    const applicationDistribution = location.href.split('/')[2];
    const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    const requestUrl = '/v1/module';
    const omodFile = this.state.files[0];
    const addonFile = new FormData();
    addonFile.append('file', omodFile);
    let fileName = this.state.files[0].name;
    fileName = fileName.substr(0, fileName.lastIndexOf('.')) || fileName;

    axios({
      url: `${urlPrefix}/${apiBaseUrl}${requestUrl}`,
      method: 'post',
      headers: {
        'Content-Type': undefined,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      data: addonFile,
      onUploadProgress: (event) => {
        this.handleProgress(event);
      }
    }).then(() => {
      this.setState((prevState, props) => {
        return {
          showMsg: true,
          msgBody: `${fileName} has been successfully installed`,
          msgType: "success",
          uploadStatus: 0,
          showProgress: false,
          files: null,
          updatesAvailable: null,
        };
      });
      this.handleApplist();
    }).catch((error) => {
      error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm` : null;
      toastr.error(error);
    });
  }

  handleUserClick(appType, name) {
    appType === "OWA"?
      toastr.info(`You would need to install the ${name} addon in order to link to it`)
      :
      toastr.info(`Sorry, there is no open web app for ${name}`);
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
    const protocol = window.location.protocol;
    $.ajax({
      xhr: function () {
        let xhrRequest = $.ajaxSetup().xhr();
        if (xhrRequest.upload) {
          xhrRequest.upload.addEventListener('progress', that.handleProgress, false);
        }
        return xhrRequest;
      },

      type: "POST",
      url: `${protocol}/${apiBaseUrl}${this.requestUrl}`,
      data: addonFile,
      contentType: false,
      processData: false,
      cache: false,
      success: function (result) {
        result.forEach((data, index) => {
          resultData.push({
            appDetails: data,
            downloadUri: null,
            install: false,
          });
          if (index === result.length - 1) {
            this.setState((prevState, props) => {
              return {
                showMsg: true,
                msgBody: `${fileName} has been successfully installed`,
                msgType: "success",
                updatesAvailable: null,
              };
            });
            this.handleApplist();
          }
        });
      }.bind(this),
      error: function (xhr, status, error) {
        error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm` : null;
        this.setState((prevState, props) => {
          return {
            msgBody: "App has not been installed",
            msgType: "warning",
            showMsg: true,
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

  handleProgress(event) {
    if (event.lengthComputable) {
      const max = event.total;
      const current = event.loaded;

      const Percentage = Math.round((current * 100) / max);
      this.setState((prevState, props) => {
        return {
          showProgress: true,
          uploadStatus: Percentage,
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
        showMsg: false,
      });
      resolve('Success');
    });
    handleClearPromise.then((response) => {
      if (response === 'Success') {
        this.displayManageOwaButtons();
      }
    });
  }

  openModal(app) {
    return (e) => {
      this.setState((prevState, props) => {
        return {
          isOpen: true,
          selectedApp: app,
        };
      });
    };
  }

  hideModal() {
    this.setState((prevState, props) => {
      return {
        isOpen: false,
        displayInvalidZip: false,
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

  handleUpgrade(addon, newVersion, addonUid) {
    this.setState({
      openUpgradeConfirmation: true,
      upgradeAddon: addon,
      upgradeVersion: newVersion,
      upgrading: true,
    });
    this.props.checkLoginStatus();
    axios.get(`${ApiHelper.getAddonUrl()}/${addonUid}`)
      .then(response => {
        const newAddon = {
          appDetails: response.data,
          downloadUri: response.data.versions[0].downloadUri,
        };
        this.setState({ newAddon });
      }).catch((error) => {
        error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm` : null;
        toastr.error(error);
      });
  }

  handleInstall(addon) {
    let addonProcess = this.state.upgrading ? 'Upgrading' : 'Installing';
    const applicationDistribution = location.href.split('/')[2];
    const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;

    this.setState({
      progressMsg: `${addonProcess} ${addon.appDetails.name}`,
    });

    if (addon && addon.appDetails.type === 'OMOD') {
      const postData = {
        "modules": [addon.appDetails.moduleId],
        "action": "install",
        "installUri": addon.downloadUri,
      };
      this.requestUrl = '/v1/moduleaction';

      axios({
        url: `${urlPrefix}/${apiBaseUrl}${this.requestUrl}`,
        method: 'post',
        data: postData,
        onUploadProgress: (event) => {
          this.handleProgress(event);
        }
      }).then(() => {
        addonProcess === 'Upgrading' ?
          toastr.success(`Upgrading ${addon.appDetails.name} to version ${this.state.upgradeVersion} was successful`) :
          toastr.success(`${addon.appDetails.name} has been successfully installed`);
        this.setState((prevState, props) => {
          return {
            uploadStatus: 0,
            showProgress: false,
            files: null,
            updatesAvailable: null,
            progressMsg: null,
            newAddon: null,
            upgrading: false,
            upgradeVersion: null,
          };
        });
        this.handleApplist();
      }).catch((error) => {
        error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm` : null;
        toastr.error(error);
        this.setState((prevState, props) => {
          return {
            uploadStatus: 0,
            showProgress: false,
          };
        });
      });
    }
    if (addon && addon.appDetails.type === 'OWA') {
      this.requestUrl = '/owa/installapp';
      let urlObject = {
        'fileName': addon.appDetails.name,
        'urlValue': addon.appDetails.versions[0].downloadUri,
      };
      const data = JSON.stringify(urlObject);
      axios({
        url: `${urlPrefix}/${apiBaseUrl}${this.requestUrl}`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
        onUploadProgress: (event) => {
          this.handleProgress(event);
        }
      }).then(() => {
        this.setState((prevState, props) => {
          return {
            showMsg: true,
            msgBody: `${addon.appDetails.name} has been successfully installed`,
            msgType: "success",
            uploadStatus: 0,
            showProgress: false,
            files: null,
            updatesAvailable: null,
            progressMsg: null,
            newAddon: null,
            upgrading: false,
          };
        });
        addonProcess === 'Upgrading' && toastr.success(`Ugrade completed successfully`);
        this.handleApplist();
      }).catch((error) => {
        toastr.error(error);
        this.setState((prevState, props) => {
          return {
            uploadStatus: 0,
            showProgress: false,
          };
        });
      });
    }
  }

  confirmUpgrade() {
    this.setState({
      openUpgradeConfirmation: false,
    });
    this.state.newAddon && this.handleInstall(this.state.newAddon);
  }

  dismissUpgradeModal() {
    this.setState({
      openUpgradeConfirmation: false,
      progressMsg: null,
      newAddon: null,
    });
  }

  fetchLocation(url) {
    const apiHelper = new ApiHelper(null);
    return new Promise(function (resolve, reject) {
      apiHelper.get(url).then(response => {
        resolve(response);
      });
    });
  }

  checkForUpdates() {
    this.setState({
      searchComplete: false,
      checkUpdates: true,
    });
    const updatesAvailable = {};
    this.props.checkLoginStatus();
    const appList = this.sortApplist(this.state.appList);
    axios.get(ApiHelper.getAddonUrl()).then((response) => {
      appList.forEach((addon) => {
        response.data.forEach((result) => {
          if (result.type === 'OMOD') {
            result.type = 'module';
          }
          if (result.type.toLowerCase() === addon.appType && addon.appDetails.name === result.name) {
            result.latestVersion > addon.appDetails.version ?
              updatesAvailable[addon.appDetails.name] = {
                type: result.type.toLowerCase(),
                version: result.latestVersion,
                uid: result.uid,
              }
              :
              null;
          }
        });
      });

      this.setState({
        updatesAvailable,
        searchComplete: true,
      });
    }).catch(
      (error) => {
        error.message === "Network Error" ? toastr.error("There is no internet connection") : toastr.error(error.message);
        this.handleApplist();
      }
    );
  }

  clearUpdates() {
    this.props.checkLoginStatus();
    this.setState({
      updatesAvailable: null,
      searchComplete: true,
      checkUpdates: false,
    });
  }

  onlineSearchHandler(searchValue) {
    this.state.searchComplete === true ? this.setState({ searchComplete: false }) : null;
    let resultData = [];
    const { staticAppList } = this.state;
    this.props.checkLoginStatus();
    if (searchValue) {
      axios.get(`${ApiHelper.getAddonUrl()}?&q=${searchValue}`)
        .then(response => {
          const searchResults = response.data;
          if (searchResults.length === 0) {
            this.setState({
              appList: [],
              searchedAddons: [],
              searchComplete: true,
              isSearched: true,
            });
          } else {
            const searchResultsPromise = searchResults.map(result => axios.get(
              `${ApiHelper.getAddonUrl()}/${result.uid}`
            ));
            Promise.all(searchResultsPromise)
              .then(results => results.forEach((result, index) => {
                resultData.push({
                  appDetails: result.data,
                  downloadUri: result.data['versions'][0] ? result.data['versions'][0].downloadUri : null,
                  install: true
                });
                if (index === searchResults.length - 1) {
                  resultData = this.sortApplist(resultData);
                  this.setState((prevState, props) => {
                    return {
                      searchedAddons: resultData,
                      searchComplete: true,
                      isSearched: true,
                    };
                  });
                }
              }))
              .catch(error => {
                if (error) {
                  this.setState({
                    appList: [],
                    searchedAddons: [],
                    searchComplete: true,
                    isSearched: true,
                  });
                }
              });
          }
        })
        .catch(error => {
          if (error) {
            this.setState({
              appList: [],
              searchedAddons: [],
              searchComplete: true,
              isSearched: true,
            });
          }
        });
    } else {
      this.setState((prevState, props) => {
        return {
          appList: staticAppList,
          searchedAddons: [],
          searchComplete: true,
          isSearched: false,
        };
      });
    }
  }

  initiateSearch(event) {
    const { staticAppList } = this.state;
    const { value } = this.input;
    if (value.length === 0 || value.length === 1) {
      this.setState({
        appList: staticAppList,
        searchComplete: true,
      });
    }
    if (event.keyCode === 13) {
      this.setState({ searchComplete: false });
      const searchValue = event.target.value;
      this.onlineSearchHandler(searchValue);
    }
  }

  getInstalled(appList, searchedAddons) {
    const installedSearchResults = { 'modules': [], 'owas': [] };
    const installedUuid = appList.reduce((filtered, app) => {
      if (app.appType === "module") app.appDetails.uuid ? filtered.push(app.appDetails.uuid) : filtered.push(app.appDetails.uid);
      return filtered;
    }, []);
    const installedNames = appList.reduce((filtered, app) => {
      if (app.appType === "owa") app.appDetails.folderName ? filtered.push(app.appDetails.folderName) : filtered.push(app.appDetails.name);
      return filtered;
    }, []);

    searchedAddons.forEach((addon) => {
      if (addon.appDetails.type === "OMOD"){
        (installedUuid.includes(addon.appDetails.moduleId) || installedUuid.includes(addon.appDetails.uid)) ?
          addon.appDetails.moduleId ? installedSearchResults['modules'].push(addon.appDetails.moduleId)
            : installedSearchResults['modules'].push(addon.appDetails.uid)
          : null
      } else {
        let installedOwa = this.getInstalledOwa(installedNames, addon);
        installedOwa ?
          installedSearchResults['owas'].push(installedOwa)
          : null;
      }
    });
    return installedSearchResults;
  }

  getInstalledOwa(installedList, app){
    return installedList.find((installedApp) =>{
      if (app.downloadUri.includes(installedApp)) return installedApp;
    });
  }

  render() {
    const {
      files,
      uploadStatus,
      showMsg,
      updatesAvailable,
      msgType,
      msgBody,
      appList,
      searchedAddons,
      checkUpdates,
      isOpen,
      isAdmin,
      allowWebAdmin,
      selectedApp,
      searchComplete,
      isSearched,
      progressMsg,
      upgradeAddon,
      upgradeVersion,
      openUpgradeConfirmation,
      cannotViewAddons,
      displayInvalidZip, } = this.state;

    if (showMsg === true) {
      setTimeout(this.handleAlertBehaviour, 6000);
    }

    const alert = (
      <div className={`col-sm-12 alert alert-${msgType} alert-dismissable`}>
        <button className="close" data-dismiss="alert" aria-label="close">×</button>
        {msgBody}
      </div>
    );


    const disableUploadElements = (uploadStatus > 0);
    disableUploadElements ? document.body.className = 'loading' : document.body.className = '';



    const buttonsInstance = (
      <DropdownButton title="Support" id="startall-modules-btn">
        <MenuItem
          eventKey="1">
          <span>
            <Link to="/manageSettings" className="manage-settings-button support-dropdown">
              Settings
            </Link>
          </span>
        </MenuItem>
        <MenuItem
          eventKey="2">
          <span>
            <Link to="/help" className="manage-settings-button support-dropdown">
              Help Guide
            </Link>
          </span>
        </MenuItem>
      </DropdownButton>
    );
    if (cannotViewAddons){
      return (
        <div className="main-home-page none-user-page" id="body-wrapper">
          <p>
            You cannot view or manage the Add Ons since you dont have the privileges
            and you are not an admin.<br/>
            <br/>

            To get the permissions contact  the system administrator.
            <br/>
            <a href="../../" className="btn btn-secondary"   id="startall-modules-btn">
                Go back Home
            </a>
          </p>
        </div>
      );
    }
    return (
      <div>
        <div className="main-home-page" id="body-wrapper">
          {allowWebAdmin ?
            isAdmin ?
              <div className="row">
                <div className="col-sm-12">
                  <span className="pull-right manage-settings-wrapper">
                    <span id="startall-modules-btn"
                      className="btn btn-secondary"
                      onClick={updatesAvailable ? this.clearUpdates : this.checkForUpdates}>{updatesAvailable ? 'Back to all Addons': 'Check for Updates'}</span>
                    <span
                      id="startall-modules-btn"
                      className="btn btn-secondary"
                      onClick={this.handleStartModules}
                    >
                      <span className="glyphicon glyphicon-play" />
                          Start all Modules
                    </span>
                    {buttonsInstance}
                  </span>
                </div>
              </div>
              : null
            :   <p>
              Settings, upload and check updates are disabled from the website at this time. The runtime property module.allow_web_admin must be set to true.
              <br/>
            </p>
          }
          <ScrollToTop showUnder={210}>
            <span className="glyphicon glyphicon-circle-arrow-up scroll-to-top-btn" />
          </ScrollToTop>

          <div className="home-page-body">
            <div className="container">
              <div id="notification-wrapper">
                {showMsg && alert}
              </div>

              {allowWebAdmin ?
                isAdmin ? <AddAddon
                  files={files}
                  handleDrop={this.handleDrop}
                  handleClear={this.handleClear}
                  handleUpload={this.handleUpload}
                  displayManageOwaButtons={this.displayManageOwaButtons}
                /> : null :null}

              <div className="manage-app-table col-sm-12">
                <div
                  className="search-add-on"
                  style={!searchComplete ? { marginBottom: 200 } : { marginBottom: 10 }}>
                  <i className="glyphicon glyphicon-search" />
                  <input
                    type="text"
                    id="search-input"
                    ref={value => this.input = value}
                    onKeyDown={this.initiateSearch}
                    placeholder={!updatesAvailable ?
                      "Need new add-ons? Type name of addon & press ENTER or clear field to display installed add-ons" :
                      "Need specific updates? Type name of addon & press ENTER or clear field to display all add-ons with updates"} />
                </div>
                <Loader loaded={searchComplete}>
                  <table className="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Developer</th>
                        <th>Version</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {
                      searchedAddons.length < 1 && isSearched ?
                        <tbody>
                          <tr>
                            <th colSpan="5"><h4>No apps found</h4></th>
                          </tr>
                        </tbody> :
                        <AddonList
                          addonList={appList}
                          isAdmin={isAdmin}
                          searchedAddons={searchedAddons}
                          handleUserClick={this.handleUserClick}
                          updatesAvailable={updatesAvailable}
                          openPage={this.openPage}
                          openModal={this.openModal}
                          handleDownload={this.handleDownload}
                          handleInstall={this.handleInstall}
                          handleUpgrade={this.handleUpgrade}
                          getInstalled={this.getInstalled}
                          getInstalledOwa={this.getInstalledOwa}
                        />
                    }
                  </table>
                </Loader>
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
        {
          progressMsg ?
            <div className="waiting-modal">
              <p className="upload-text">{progressMsg}</p>
            </div>
            : disableUploadElements &&
            <div className="waiting-modal">
              <p className="upload-text">Uploading {uploadStatus}%</p>
            </div>}
        {
          <ConfirmationModal
            addon={upgradeAddon}
            upgradeVersion={upgradeVersion}
            isOpen={openUpgradeConfirmation}
            confirmUpgrade={this.confirmUpgrade}
            dismissUpgradeModal={this.dismissUpgradeModal}
            message={{}} />
        }
      </div>
    );
  }
}

ManageApps.propTypes = {
  checkLoginStatus: PropTypes.func.isRequired,
};
