/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
import PropTypes from 'prop-types';

export default function AddAddon({ handleClear, handleUpload }) {
  return (
    <div className="container-fluid">
      <fieldset className="scheduler-border">
        <legend className="scheduler-border">Upload Addon Package:</legend>
        <div className="row">
          <div className="col-xs-12">
            <div className="col-xs-6 col-sm-8 col-md-8 col-lg-8">
              <input 
                name="file"
                type="file" 
                id="fileInput"
                accept=".zip"
                data-text="Browse Addon"
                data-buttonName="btn-primary"
                data-placeholder="Select Addon to upload"
                data-btnClass="btn-primary"
                className="filestyle" />
            </div>
            <div className="col-xs-6 col-sm-4 col-md-4 col-lg-4">
              <div className="row">
                <div className="btn-toolbar">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpload}>
                    <span 
                      className="glyphicon glyphicon-upload" /> Upload</button>
                  <button
                    className="btn btn-danger"
                    onClick={handleClear}>
                    <span 
                      className="glyphicon glyphicon-remove" /> Clear Addon</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

AddAddon.propTypes = {
  handleClear: PropTypes.func.isRequired,
  handleUpload: PropTypes.func.isRequired,
};
