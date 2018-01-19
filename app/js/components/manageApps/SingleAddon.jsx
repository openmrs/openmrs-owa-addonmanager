import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { ApiHelper } from '../../helpers/apiHelper';

export default class SingleAddon extends React.Component{
  constructor(props){
    super(props);
    this.getUpdate = this.getUpdate.bind(this);
  }

  getUpdate(e, uid){
    e.preventDefault();
    axios.get(`${ApiHelper.getAddonUrl()}/${uid}`)
      .then(response => {
        response.data.versions[0].downloadUri?
          location.href = response.data.versions[0].downloadUri
          :
          null;
      }).catch((error) =>{
        toastr.error(error);
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
    } = this.props;

    return(
      <tr key={key}>
        <td>
          <img
            src={app.appDetails &&
                        app.appDetails.icon !== null &&
                        app.appDetails.icons !== undefined ?
              `/${location.href.split('/')[3]}/owa/openmrs-addonmanager/${app.appDetails.icons[48]}` :
              `./img/omrs-button.png`}
            alt="addon logo"
          />
        </td>
        <td>
          <div className="addon-name">
            {
              !app.install ?
                app.appDetails.started === true || app.appDetails.started === undefined ?
                  <div className="status-icon" id="started-status" />
                  :
                  <div className="status-icon" id="stopped-status" />
                : null
            }
            {app.appType === "module" || app.appDetails.type === "OMOD" ?
              <span
                className="module-click-cursor"
                onClick={() => handleUserClick(app.appDetails.name)}>
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
            app.appDetails && app.appDetails.uuid ?
              app.appDetails.author :
              app.appDetails && app.appDetails.developer ?
                app.appDetails.developer.name :
                app.appDetails.maintainers.map(maintainer => maintainer.name).join(', ')
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
};
