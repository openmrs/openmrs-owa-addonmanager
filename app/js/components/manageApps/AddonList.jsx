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

import SingleAddon from './SingleAddon.jsx';

export const AddonList = ({
  handleDownload,
  addonList,
  openPage,
  openModal,
  handleUserClick,
  updatesAvailable,
  searchedAddons,
  getInstalled,
  handleInstall,
  handleUpgrade,
}) => {
  let installedSearchResults;
  const appList =  searchedAddons.length > 0 ? searchedAddons : addonList;
  searchedAddons.length > 0 ? installedSearchResults = getInstalled(addonList, searchedAddons) : null;

  return (
    <tbody>
      {
        appList.map((app, key) => {
          let found = null;
          (app.appType === "owa" || app.appDetails.type === "OWA") ?
            searchedAddons.length > 0 && (installedSearchResults['owas'].includes(app.appDetails.name) || installedSearchResults['owas'].includes(app.appDetails.folderName)) ?
              found = addonList.find(addon => (addon.appDetails.folderName === app.appDetails.name || addon.appDetails.name === app.appDetails.name)):null
            :
            searchedAddons.length > 0 && (installedSearchResults['modules'].includes(app.appDetails.moduleId) || installedSearchResults['modules'].includes(app.appDetails.uid)) ?
              found = addonList.find(addon => (addon.appDetails.uuid === app.appDetails.moduleId || addon.appDetails.uid === app.appDetails.uid)
              ) : null;

          if (found) {
            app = found;
          }
          let addonParam = app.appDetails.uuid ?
            'module-' + app.appDetails.uuid : 'owa-' + app.appDetails.name;
          return (
            updatesAvailable ?
              updatesAvailable.hasOwnProperty(app.appDetails.name) && updatesAvailable[app.appDetails.name].type === app.appType ?
                <SingleAddon
                  app={app}
                  key={key}
                  addonParam={addonParam}
                  handleUserClick={handleUserClick}
                  updatesVersion={updatesAvailable[app.appDetails.name]}
                  handleUpgrade={handleUpgrade}
                />
                :
                null
              :
              <SingleAddon
                app={app}
                key={key}
                handleUserClick={handleUserClick}
                handleDownload={handleDownload}
                openPage={openPage}
                addonParam={addonParam}
                updatesVersion={null}
                handleInstall={handleInstall}
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
  handleUserClick: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  searchedAddons: PropTypes.array.isRequired,
  getInstalled: PropTypes.func.isRequired,
  handleInstall: PropTypes.func.isRequired,
  handleUpgrade: PropTypes.func.isRequired,
};
