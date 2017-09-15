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
import DeleteAddonModal from '../manageApps/deleteAddonModal.jsx';

export const AddonList = ({appList, openPage, handleDelete}) => {
  return (
    <tbody>
      {
        appList.map((app, key) => {
          return (
            <tr key={key}>
              <td onClick={() => openPage(app)}>
                <img
                  src={`/${location.href.split('/')[3]}/owa/openmrs-addonmanager/${app.icons[48]}`}
                  alt="addon logo"
                />
              </td>
              <td onClick={() => openPage(app)}>
                <div className="addon-name">{app.name}</div>
                <div><h5  className="addon-description">{app.description}</h5></div>
              </td>
              <td onClick={() => openPage(app)}>
                {app.developer.name}
              </td>
              <td onClick={() => openPage(app)}>
                {app.version}
              </td>
              <td
                className="text-center"
                id="delete-icon-wrapper"
                data-toggle="modal"
                data-target={`#formModal${app.folderName}`}
              >
                <i className="glyphicon glyphicon-trash text-danger delete-icon"/>
              </td>
              
              <DeleteAddonModal app={app} handleDelete={handleDelete} />
            </tr>

          );
        })
      }
      
    </tbody>
  );
};

AddonList.propTypes = {
  appList: React.PropTypes.array.isRequired,
  openPage: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
};