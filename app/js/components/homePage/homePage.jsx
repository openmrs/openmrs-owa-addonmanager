/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

export default class HomePage extends React.Component {
  render() {
    return (
      <div className="main-home-page">
        <h2>Add On Manager</h2>
        <div className="home-page-body">
          <Link to="/manageApps" className="manage-app-button">
            <button type="button" className="button">
              <span className="glyphicon glyphicon-th-large button-icon"></span><h5> Manage Apps </h5>
            </button> 
          </Link>
          <Link to="/manageSettings" className="manage-settings-button">
            <button  type="button" className="button">
              <span className="glyphicon glyphicon-cog button-icon"></span><h5> Manage Settings</h5>
            </button>
          </Link>
        </div>
      </div>
    )
  }
}
