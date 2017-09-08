/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';

export default class ManageApps extends React.Component {
  render() {
    return (
      <div>
        <h3 id="manageApps">Manage Add Ons</h3>
        <div className="manage-app-buttons">
          <button type="button" className="button-add-module ">
            <span className="glyphicon glyphicon-plus span-icon"></span>  Add/Upgrade Add ons
          </button> 
          <button type="button" className="button-search-module">
            <span className="glyphicon glyphicon-search span-icon search-icon"></span>Search Add ons
          </button> 
        </div>
        <div className="manage-app-table col-sm-10">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Developer</th>
                <th>Version</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
