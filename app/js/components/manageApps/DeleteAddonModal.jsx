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
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter} from 'react-modal-bootstrap';

export default class DeleteModal extends Component {
  render() {
    const { app, handleDelete, isOpen, hideModal } = this.props;
    return (
      <Modal isOpen={isOpen} onRequestHide={hideModal}>
        <ModalHeader>
          <ModalClose onClick={hideModal}/>
          <ModalTitle>Confirm Delete</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete <strong>{app.name}</strong>?</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-default" onClick={hideModal}>Cancel</button>
          <button
            type="button"
            className="btn btn-danger"
            data-dismiss="modal"
            id="cancel-btn"
            onClick={() => handleDelete(app.name)}
          >Delete</button>
        </ModalFooter>
      </Modal> 
    );
  }
}

DeleteModal.propTypes = {
  app: React.PropTypes.object.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired,
  hideModal: React.PropTypes.func.isRequired
};
