/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React, { Component } from 'react';

export default class DeleteModal extends Component {
  render() {
    const { app, handleDelete } = this.props;
    return (
      <div className="modal fade" id={`formModal${app.folderName}`} role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Confirm Delete</h4>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{app.name}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => handleDelete(app.name)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DeleteModal.propTypes = {
  app: React.PropTypes.object.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
};