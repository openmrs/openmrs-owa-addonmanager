/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

export default class AddAddon extends Component {
  constructor() {
    super();
    this.state = {
      disableClick: true,
      dropzoneRef: {},
    };
    this.showMessage = this.showMessage.bind(this);
  }

  showMessage() {
    const { files } = this.props;
    if (files == null || files.length < 1) {
      return (
        <p>Drag file here to upload or
          <a id="click-to-select" href=""
            onClick={(e) => {
              e.preventDefault(); this.state.dropzoneRef.open();
            }}> Click to here select</a>
        </p>
      );
    }
    else {
      return (
        <p>{files[0].name}</p>
      );
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row drop-zone-container">
          <span>Select an Add-on to upload</span>
          <Dropzone
            className="drop-zone"
            acceptClassName="drop-zone-accept"
            rejectClassName="drop-zone-reject"
            disableClick={this.state.disableClick}
            ref={(node) => { this.state.dropzoneRef = node; }}
            onDrop={(files) => this.props.handleDrop(files)}
          >
            {this.showMessage}
          </Dropzone>
          {this.props.displayManageOwaButtons()}
        </div>
      </div>
    );
  }
}

AddAddon.propTypes = {
  handleClear: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  handleUpload: PropTypes.func.isRequired,
  displayManageOwaButtons: PropTypes.func.isRequired,
};
