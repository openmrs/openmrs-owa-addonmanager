/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {Component} from 'react';
import { Link } from 'react-router';
import './breadCrumb.css';

class BreadCrumbComponent extends Component{
  constructor(props) {
    super(props);

    this.state = {
      manageSettingsPage: false,
      manageAddonPage: false,
      homePage: false
    };
  }
  componentWillMount(){
    const currentTab = window.location.href.split('/').pop();
    if (currentTab === '/') {
      this.setState({
        homePage: true,
        manageSettingsPage: false,
        manageAddonPage: false,
      });
    } else if(currentTab === 'manageSettings') {
      this.setState({
        manageSettingsPage: true,
        manageAddonPage: false,
        homePage: false
      });
    }else if (currentTab === 'manageApps') {
      this.setState({
        manageAddonPage: true,
        manageSettingsPage: false,
        homePage: false,
      });
    }
  }

  render(){
    let {
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
          manageAddonPage || manageSettingsPage ?
            <Link to="/">
              <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
                aria-hidden="true" />
              <span className="title breadcrumb-item">
                <u>Add-On Manager</u>
              </span>
            </Link> :
            <Link to="/">
              <span className="glyphicon glyphicon-chevron-right breadcrumb-item separator"
                aria-hidden="true" />
              <span className="title breadcrumb-item">
                <strong>Add-On Manager</strong>
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
      </div>
    );
  }
}

export default BreadCrumbComponent;
