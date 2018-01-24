import React from 'react';
import PropTypes from 'prop-types';

import checkforupdates from '../../../img/checkforupdates.png';
import updateslist from '../../../img/updateslist.png';
import view from '../../../img/view.png';
import start from '../../../img/start.png';
import stop from '../../../img/stop.png';
import startingallmodules from '../../../img/startingallmodules.png';

export default class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AppBaseURLValue: '',
      AppFolderPathValue: '',
      AppStoreURLValue: '',
    };

    this.onChange = this.onChange.bind(this);
    this.setDefault = this.setDefault.bind(this);
    this.getDefaultSettings = this.getDefaultSettings.bind(this);
  }

  componentWillMount() {
    this.props.checkLoginStatus();
    this.getDefaultSettings();
  }

  settingsData() {
    const applicationDistribution = location.href.split('/')[3];
    const settingsURL = `/${applicationDistribution}/ws/rest/owa/settings`;
    global.$ = require('jquery');

    const data = $.ajax({
      type: "GET",
      url: settingsURL,
      dataType: "xml",
      async: false,
    }).responseText;

    const parser = require('xml2js').parseString;
    let jsonData;

    parser(data, function (err, result) {
      jsonData = result;
    });

    try {
      return jsonData.list["org.openmrs.GlobalProperty"];
    } catch (e) {
      if (e instanceof TypeError) {
        e;
      }
    }
  }

  getDefaultSettings() {
    const settingsPaths = this.settingsData();
    const appFolderPath = String.raw`appdata\owa`;
    this.setState((prevState, props) => {
      return {
        AppFolderPathValue: settingsPaths != undefined ? settingsPaths[0].propertyValue : appFolderPath,
        AppBaseURLValue: settingsPaths != undefined ? settingsPaths[1].propertyValue : '/owa',
        AppStoreURLValue: settingsPaths != undefined ? settingsPaths[2].propertyValue : 'http://modules.openmrs.org',
      };
    });
  }

  setDefault() {
    event.preventDefault();
    this.getDefaultSettings();
  }

  onChange(event) {
    event.preventDefault();
    this.setState((prevState, props) => {
      return {
        [event.target.name]: event.target.value
      };
    });
  }

  render() {
    let {
      AppBaseURLValue,
      AppFolderPathValue,
      AppStoreURLValue,
    } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col-sm-6">
            <h2 id="title-heading">Add On Manager</h2>
          </div>
        </div>
        <div className="container-fluid" id="manage-settings">
          <form className="form-horizontal">
            <fieldset className="scheduler-border">
              <legend className="scheduler-border">Having trouble?We're here to help</legend>

              <section>
                <p><strong>How do you check for updates?</strong></p>
                <p>To check for newer versions of installed addons click on the check for updates button
                  <img src={(checkforupdates)} className="help-page-images" alt="Add-On manager homepage" /><br />
                      If any addons have updates they'll be in the resulting list e.g
                  <img src={(updateslist)} className="help-page-images" alt="Add-On manager homepage" /></p>
                <p> The latest version will be displayed as shown above
                    A user can upgrade by clicking on the upgrade button or download the new file.
                    A user can decide to go back to the original addon list by clicking the back to all addons
                </p>
              </section>
              <section>
                <p><strong>What does the view button do?</strong></p>
                <p>In order to view the interface of a particular module, you click on the view button as shown
                  <img src={(view)} className="help-page-images" alt="Add-On manager homepage" /><br /></p>
                <p>When you click on a module, the resulting UI should be as shown below.Only modules have the stop and start button.When a module starts it is indicated by a green icon
                   and when it stops, a red icon is displayed on the status.A stopped module is still loaded, it just doesn't have any effect on the system</p>
                <p><strong>The start icon</strong></p>
                <img src={(start)} className="help-page-images" alt="Add-On manager homepage" />
                <p>If you start a module while the modules it depends on to run are not started, that module will not start.</p>
                <p><strong>The stop icon</strong></p>
                <img src={(stop)} className="help-page-images" alt="Add-On manager homepage" /><br />
                                Additionally, stopping a module that is depended on by other modules will cause all dependent modules to stop
                <p>You might want to start all the modules at once.This has been made possible by simply clicking on the start all modules button as shown</p>
                <img src={(startingallmodules)} className="help-page-images" alt="Add-On manager homepage" />

              </section>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

Help.propTypes = {
  checkLoginStatus: PropTypes.func.isRequired,
};
