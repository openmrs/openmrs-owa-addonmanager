import React, { Component } from 'react';
import axios from 'axios';
import Loader from 'react-loader';
import PropTypes from 'prop-types';
import { ApiHelper } from '../../helpers/apiHelper';
import ActionAddonModal from './ActionAddonModal';
import StartErrorModal from './StartErrorModal';
import { Link, hashHistory } from 'react-router';

class Addon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      app: {},
      affectedModules: null,
      action: null,
      stopping: false,
      starting: false,
      isOpen: false,
      showMessageDetail: false,
      loadingComplete: false,
      messageBody: '',
      messageType: 'success',
      showMessage: false,
    };
    this.apiHelper = new ApiHelper(null);
    this.fetchOwa = this.fetchOwa.bind(this);
    this.fetchModule = this.fetchModule.bind(this);
    this.fetchAddon = this.fetchAddon.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.actionRunning = this.actionRunning.bind(this);
    this.handleAddonAction = this.handleAddonAction.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.getAffectedModules = this.getAffectedModules.bind(this);
    this.handleMessageClick = this.handleMessageClick.bind(this);
    this.hideMsgModal = this.hideMsgModal.bind(this);
  }

  componentWillMount(){
    this.props.checkLoginStatus();
  }

  componentDidMount() {
    this.fetchAddon();
    document.title = "Add-On Information";
  }

  fetchAddon() {
    const fileName = this.props.params.addonName;
    const addonType = fileName.substr(0, fileName.indexOf('-'));
    if (addonType === 'module') {
      this.fetchModule(fileName);
    } else if (addonType === 'owa') {
      this.fetchOwa(fileName);
    }
  }

  fetchModule(fileName) {
    this.state.loadingComplete === true ? this.setState({ loadingComplete: false }) : null;
    const moduleName = fileName.substr(fileName.indexOf('-') + 1, fileName.length - 1);
    const applicationDistribution = location.href.split('/')[2];
    const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    this.requestUrl = '/v1/module/' + moduleName + '?v=full';
    axios.get(`${urlPrefix}/${apiBaseUrl}${this.requestUrl}`)
      .then(response => {
        this.getAffectedModules(response.data.uuid);
        this.setState({
          app: response.data,
          loadingComplete: true
        });
      }).catch((error) => {
        error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm`: null
        this.setState({ loadingComplete: true });
      });

  }

  fetchOwa(fileName) {
    this.state.loadingComplete === true ? this.setState({ loadingComplete: false }) : null;
    const owaName = fileName.substr(fileName.indexOf('-') + 1, fileName.length - 1);
    this.apiHelper.get('/owa/applist').then(response => {
      response.forEach((data, index) => {
        if (data.name === owaName) {
          this.setState({
            app: data,
            loadingComplete: true
          });
          return true;
        }
      });
    }).catch((error) => {
      error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm`: null
    });
  }

  handleAction(moduleUuid, action, event=null) {
    event? event.preventDefault(): this.hideModal();
    if (action === 'stop') {
      this.setState((prevState, props) => {
        return {
          stopping: true,
        };
      });
    } else if (action === 'start') {
      this.setState({
        starting: true
      });
    }
    const applicationDistribution = location.href.split('/')[2];
    const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    this.requestUrl = '/v1/moduleaction';
    let postData = {};

    if (moduleUuid != null) {
      postData = {
        "action": action,
        "modules": [moduleUuid],
      };
    }

    axios.post(`${urlPrefix}/${apiBaseUrl}${this.requestUrl}`, postData)
      .then(response => {       
        const moduleName = response.data.modules[0].display;
        this.setState({
          stopping: false,
          starting: false,
          messageBody: response.data.action == 'START' ? 
            `${moduleName} module has started` 
            : 
            `${moduleName} module has stopped`,
          messageType: 'success',
          showMessage: true,
        });
        this.fetchAddon();
      }).catch((error) => {
        error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm`: null
        this.setState({
          stopping: false,
          starting: false,
        });
        this.fetchAddon();
      }
      );
  }

  handleMessageClick(event) {
    event.preventDefault();
    this.setState({
      showMessageDetail: true,
    });
  }

  handleAddonAction(event, action) {
    event.preventDefault();
    this.setState({
      isOpen: true,
      action: action
    });
  }

  getAffectedModules(appUuid) {
    const applicationDistribution = location.href.split('/')[2];
    const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}`;
    this.requestUrl = '/admin/modules/manage/checkdependencies.form?moduleId=' + appUuid;
    axios.get(`${urlPrefix}/${apiBaseUrl}${this.requestUrl}`)
      .then(response => {
        response.data ?
          this.setState({
            affectedModules: response.data.join(', ')
          })
          :
          null;
      }).catch((error) => {
        error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm`: null
        toastr.error(error);
      });
  }

  handleDelete(appUuid, name) {
    this.setState((prevState, props) => {
      return {
        deleting: true,
      };
    });

    if (appUuid != null) {
      const applicationDistribution = location.href.split('/')[2];
      const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
      const url = location.href.split('/')[3];
      const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
      this.requestUrl = '/v1/moduleaction';
      let postData = {};

      postData = {
        "action": "unload",
        "modules": [appUuid],
      };

      axios.post(`${urlPrefix}/${apiBaseUrl}${this.requestUrl}`, postData)
        .then(response => {
          this.setState((prevState, props) => {
            return {
              deleting: false,
            };
          });
          toastr.success("Delete Successful");
          hashHistory.push('/');
        }).catch(error => {
          toastr.error(error);
          error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm`: null
          hashHistory.push('/');
        });
    } else {
      const applicationDistribution = location.href.split('/')[3];
      axios.get(`/${applicationDistribution}/module/owa/deleteApp.form?appName=${name}&returnURL=manage.form`)
        .then(response => {
          this.setState((prevState, props) => {
            return {
              deleting: false,
            };
          });
          toastr.success("Delete Successful");
          hashHistory.push('/');
        }).catch(error => {
          toastr.error(error);
          error.response.status === 401 ? location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm`: null
          hashHistory.push('/');
        });
    }
    this.hideModal();
  }

  actionRunning() {
    if (this.state.stopping) {
      return (<div className="happening"><p className="upload-text">Stopping Module</p></div>);
    } else if (this.state.starting) {
      return (<div className="happening"><p className="upload-text">Starting Module</p></div>);
    } else if (this.state.deleting) {
      return (<div className="happening"><p className="upload-text">Deleting Module</p></div>);
    }
  }

  hideModal() {
    this.setState((prevState, props) => {
      return {
        isOpen: false,
        displayInvalidZip: false
      };
    });
  }

  hideMsgModal() {
    this.setState(() => {
      return {
        showMessageDetail: false,
      };
    });
  }

  render() {
    const {
      app, 
      isOpen, 
      showMessageDetail, 
      affectedModules, 
      action, 
      loadingComplete,
      messageBody,
      messageType,
      showMessage } = this.state;
      
    const message = app.startupErrorMessage && app.startupErrorMessage.length > 0 ?
      'Error starting '
      : null;

    const alert = (
      <div className={`col-sm-12 alert alert-${messageType} alert-dismissable`}>
        <button className="close" data-dismiss="alert" aria-label="close">×</button>
        {messageBody}
      </div>
    );

    return (
      <div className="container-fluid addon">
        {
          app.startupErrorMessage && app.startupErrorMessage.length > 0 ?
            <div className="message-container">
              <div className="col-sm-12 alert alert-danger alert-dismissable action-message">
                <span className="glyphicon glyphicon-warning-sign" id="error-msg-logo" />
                <span>{message}</span>
                <div>
                  <a
                    href="#"
                    className="btn btn-danger error-detail"
                    onClick={this.handleMessageClick}>
                    Click for details
                  </a>
                </div>
              </div>
              <StartErrorModal
                app={app}
                message={message}
                isOpen={showMessageDetail}
                hideMsgModal={this.hideMsgModal}
              />
            </div>
            : null
        }
        <Link to="/">
          <div className="btn back-nav">
            <span className="glyphicon glyphicon-chevron-left back-nav" />
            Back to Add-Ons List
          </div>
        </Link>

        <div id="notification-wrapper">
          {showMessage && alert }
        </div>

        <Loader loaded={loadingComplete} top="35%">
          <div className="title-container">
            <h3 id="addon-name">{app.name}</h3>
            <p id="addon-description">{app.description}</p>
            {app.uuid ?
              <p id="addon-description">NOTE: Adding, removing, or starting modules will restart OpenMRS, meaning that all scheduled tasks and background processes will be interrupted.</p>
              :
              null
            }
          </div>
          {
            this.actionRunning()
          }
          <table className="table addon-table">
            <tbody>
              <tr>
                <td className="row-title">Status:</td>
                <td>
                  {
                    app.started == true || app.started == undefined ?
                      <div className="status-icon" id="started-status" />
                      :
                      <div className="status-icon" id="stopped-status" />
                  }
                </td>
              </tr>
              <tr>
                <td className="row-title">Version:</td>
                <td>{app.version}</td>
              </tr>
              <tr>
                <td className="row-title">Type:</td>
                <td>
                  {
                    app.uuid ?
                      "Module" :
                      "OWA"
                  }
                </td>
              </tr>
              <tr>
                <td className="row-title">Maintainers/Developers:</td>
                <td>
                  {
                    app.uuid ?
                      app.author :
                      app.developer ?
                        app.developer.name :
                        app.maintainers ?
                          app.maintainers[0].name : ""
                  }
                </td>
              </tr>
            </tbody>
          </table>

          <button
            type="button"
            className="btn btn-danger btn-delete btn-lower-margin"
            onClick={(event) => this.handleAddonAction(event, "delete")}
          >
            Delete
          </button>

          {
            app.uuid ?
              app.started ?
                <button
                  type="button"
                  className="btn btn-primary module-control btn-lower-margin"
                  onClick={(event) => this.handleAddonAction(event, "stop")}
                >
                  Stop
                </button>
                :
                <button
                  type="button"
                  className="btn btn-success module-control btn-lower-margin"
                  onClick={(event) => this.handleAction(app.uuid, "start", event)}
                >
                  Start
                </button>
              :
              <span />
          }
          {isOpen ? (
            <ActionAddonModal
              app={app}
              handleAction={(action === "delete")? this.handleDelete : this.handleAction}
              isOpen={isOpen}
              hideModal={this.hideModal}
              appUuid={app.uuid ? app.uuid : null}
              affectedModules = {affectedModules}
              action = {action}/>
          ) : null}
        </Loader>
      </div>
    );
  }
}

export default Addon;
Addon.propTypes = {
  checkLoginStatus: PropTypes.func.isRequired,
};
