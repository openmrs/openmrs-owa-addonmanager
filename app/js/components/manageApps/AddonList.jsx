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
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import SingleAddon from './SingleAddon.jsx';

export const AddonList = ({
  handleDownload,
  addonList,
  openPage,
  openModal,
  updatesAvailable,
  searchedAddons,
  getInstalled,
}) => {
  let installedSearchResults;
  const appList =  searchedAddons.length > 0 ? searchedAddons : addonList;
  searchedAddons.length > 0 ? installedSearchResults = getInstalled(addonList, searchedAddons) : null;

  return (
    <tbody>
      {
        appList.map((app, key) => {
          let found = null;
          searchedAddons.length > 0 && installedSearchResults.includes(app.appDetails.name) ?
            found = addonList.find(addon => addon.appDetails.name === app.appDetails.name) : null;
          if (found) {
            app = found;
          }
          let addonParam = app.appDetails.uuid ?
            'module-' + app.appDetails.uuid : 'owa-' + app.appDetails.name;
          return (
            updatesAvailable?
              updatesAvailable.hasOwnProperty(app.appDetails.name)?
                <SingleAddon
                  app={app}
                  key={key}
                  addonParam={addonParam}
                  updatesVersion={updatesAvailable[app.appDetails.name]}
                />
                :
                null
              :
              <SingleAddon
                app={app}
                key={key}
                handleDownload={handleDownload}
                openPage={openPage}
                addonParam={addonParam}
                updatesVersion={null}
              />
          );
        })
      }
    </tbody>
  );
};

AddonList.propTypes = {
  addonList: PropTypes.array.isRequired,
  openPage: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  searchedAddons: PropTypes.array.isRequired,
  getInstalled: PropTypes.func.isRequired,
};
