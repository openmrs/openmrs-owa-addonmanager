import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import StartErrorModal from './StartErrorModal';

import { ApiHelper } from '../../helpers/apiHelper';

export default class SingleAddon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageDetail: false
    };
    this.getUpdate = this.getUpdate.bind(this);
    this.handleMessageClick = this.handleMessageClick.bind(this);
    this.hideMessageModal = this.hideMessageModal.bind(this);
  }

  getUpdate(e, uid) {
    e.preventDefault();
    axios.get(`${ApiHelper.getAddonUrl()}/${uid}`)
      .then(response => {
        response.data.versions[0].downloadUri ?
          location.href = response.data.versions[0].downloadUri
          :
          null;
      }).catch((error) => {
        toastr.error(error);
      });
  }

  handleMessageClick(event) {
    event.preventDefault();
    this.setState({
      showMessageDetail: true,
    });
  }

  hideMessageModal() {
    this.setState(() => {
      return {
        showMessageDetail: false,
      };
    });
  }

  render(){
    const {
      app,
      key,
      addonParam,
      updatesVersion,
      handleUserClick,
      handleDownload,
      openPage,
      handleInstall,
      handleUpgrade,
      showMessageDetail
    } = this.props;

    const maintainers = app.appDetails.maintainers ? app.appDetails.maintainers : app.appDetails.developer.name;
    const message = app.appDetails.startupErrorMessage && app.appDetails.startupErrorMessage.length > 0 ?
      'Error starting '
      : null;

    return (
      <tr key={key}>
        <td>
          <div className="addon-name">
            {
              app.appType === "owa"?
                <div className="status-icon" id="started-status"/>
                : !app.install ?
                  app.appDetails.started === true?
                    <div className="status-icon" id="started-status" />
                    :
                    !app.appDetails.startupErrorMessage ?
                      <div className="status-icon" id="stopped-status" />
                      : <span className="glyphicon glyphicon-warning-sign" id="error-title-logo"  onClick={(event) => this.handleMessageClick(event)}/>
                  : null
            }
            <StartErrorModal
              app={app.appDetails}
              message={message}
              isOpen={this.state.showMessageDetail}
              hideMessageModal={this.hideMessageModal}
            />
            {app.appType === "module" || app.appDetails.type === "OMOD" ?
              <span
                className="module-click-cursor"
                onClick={() => handleUserClick(
                  app.appType? app.appType: app.appDetails.type, app.appDetails.name)}>
                {app.appDetails && app.appDetails.name}
              </span>
              : app.install ?
                <span
                  className="module-click-cursor"
                  onClick={() => handleUserClick(app.appDetails.type, app.appDetails.name)}>
                  {app.appDetails && app.appDetails.name}
                </span>
                :
                <span
                  className="app-details"
                  onClick={() => openPage(app.appDetails)}>
                  {app.appDetails && app.appDetails.name}
                </span>
            }
          </div>
          <div><h5 className="addon-description">
            {app.appDetails && app.appDetails.description}
          </h5></div>
          {
            updatesVersion ?
              <span>
                <span className="update-notification">New version Available {updatesVersion.version}
                </span>
                <span
                  className="glyphicon glyphicon-download-alt download-update"
                  onClick={(event) => this.getUpdate(event, updatesVersion.uid)}
                />
                <span
                  className="btn btn-secondary"
                  id="upgrade-btn"
                  onClick={(event) => handleUpgrade(app, updatesVersion.version, updatesVersion.uid)}>Upgrade
                </span>
              </span>
              : null
          }
        </td>
        <td>
          {
            Array.isArray(maintainers) ? maintainers.map(maintainer => maintainer.name).join(', ') : maintainers
          }
        </td>
        <td>
          {app.appDetails.version ?
            app.appDetails.version :
            app.appDetails.latestVersion}
        </td>
        <td
          className="text-center"
          id="view-icon-wrapper"
        >
          {
            app.install === false ?
              <Link
                to={{
                  pathname: "addon/" + addonParam,
                }}
              >
                <button id="view-addon-btn" className="btn btn-secondary">
                  <i className="glyphicon glyphicon-expand view-icon" />
                  View
                </button>
              </Link>
              :
              <span>
                <span
                  className="btn btn-secondary"
                  id="install-addon-btn"
                  onClick={(event) => handleInstall(app)}>
                  Install
                </span>
                <br />
                <br />
                <span>or </span>
                <a href="#"
                  className="download-link"
                  onClick={(event) => handleDownload(app.downloadUri)(event)}>
                  Download
                </a>
              </span>
          }
        </td>
      </tr>
    );
  }
}

SingleAddon.propTypes = {
  app: PropTypes.object.isRequired,
  addonParam: PropTypes.func.isRequired,
  updatesVersion: PropTypes.object.isRequired,
  handleDownload: PropTypes.func.isRequired,
  handleInstall: PropTypes.func.isRequired,
  handleUpgrade: PropTypes.func.isRequired,
  openPage: PropTypes.func.isRequired,
  handleUserClick: PropTypes.func.isRequired,
  showMessageDetail: PropTypes.bool.isRequired,
};
