/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import './breadCrumb.css';

class BreadCrumbComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addonPage: false,
      manageSettingsPage: false,
      manageAddonPage: false,
      homePage: false,
      helpPage: false,
    };
  }
  componentWillMount() {
    browserHistory.listen(location => {
      const currentTab = location.hash.split('/').pop();
      if (!currentTab) {
        this.setState((prevState, props) => {
          return {
            homePage: true,
            addonPage: false,
            manageSettingsPage: false,
            manageAddonPage: false,
            helpPage: false,
          };
        });
      } else if (currentTab === 'manageSettings') {
        this.setState((prevState, props) => {
          return {
            manageSettingsPage: true,
            manageAddonPage: false,
            addonPage: false,
            homePage: false,
            helpPage: false,
          };
        });
      } else if (currentTab === 'manageApps') {
        this.setState((prevState, props) => {
          return {
            manageAddonPage: true,
            manageSettingsPage: false,
            addonPage: false,
            homePage: false,
            helpPage: false,
          };
        });
      } else if (currentTab === 'help') {
        this.setState((prevState, props) => {
          return {
            helpPage: true,
            manageAddonPage: false,
            addonPage: false,
            homePage: false,
          };
        });
      }
      else if (location.hash.split('/')[1] === 'addon') {
        this.setState((prevState, props) => {
          return {
            manageAddonPage: false,
            manageSettingsPage: false,
            addonPage: true,
            homePage: false,
            helpPage: false,
          };
        });
      }
    });
  }

  render() {
    let {
      helpPage,
      addonPage,
      homePage,
      manageSettingsPage,
      manageAddonPage
    } = this.state;
    
    return (
      <div className="breadcrumb">
        <a href="../../" className="breadcrumb-item">
          <span className="glyphicon glyphicon-home breadcrumb-item" aria-hidden="true" />
        </a>
        {
          manageAddonPage || manageSettingsPage || addonPage || helpPage ?
            <Link to="/">
              <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
                aria-hidden="true" />
              <span className="title breadcrumb-item">
                <u>Add On Manager</u>
              </span>
            </Link> :
            <Link to="/">
              <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
                aria-hidden="true" />
              <span className="title breadcrumb-item">
                <strong>Add On Manager</strong>
              </span>
            </Link>
        }
        {
          manageAddonPage &&
          <Link to="manageApps">
            <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
              aria-hidden="true" />
            <span className="title breadcrumb-item">
              <strong>Manage addon</strong>
            </span>
          </Link>}
        {
          manageSettingsPage &&
          <Link to="manageSettings">
            <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
              aria-hidden="true" />
            <span className="title breadcrumb-item">
              <strong>Settings</strong>
            </span>
          </Link>
        }
        {
          addonPage &&
          <span>
            <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
              aria-hidden="true" />
            <span className="title breadcrumb-item">
              <strong>Add-On</strong>
            </span>
          </span>
        }
        {
          helpPage &&
          <Link to="help">
            <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
              aria-hidden="true" />
            <span className="title breadcrumb-item">
              <strong>Help</strong>
            </span>
          </Link>
        }
      </div>
    );
  }
}

export default BreadCrumbComponent;
