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
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from 'react-modal-bootstrap';

export default class ActionModal extends Component {
  render() {
    const { app, handleAction, isOpen, hideModal, appUuid, affectedModules, action } = this.props;
    return (
      affectedModules ?
        <Modal isOpen={isOpen} onRequestHide={hideModal}>
          <ModalHeader>
            <ModalClose onClick={hideModal}/>
            <ModalTitle><span className="dependency-alert">Attention. Dependent Modules Detected!</span></ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>The following modules will be shutdown if you decide to continue to { (action === "stop") ? 'stop' : 'delete' } <strong>{app.name}</strong>:</p>
            <p> {affectedModules} </p>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-default" onClick={hideModal}>Cancel</button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              id="cancel-btn"
              onClick={() => (action === 'delete') ? handleAction(appUuid, app.name): handleAction(appUuid, action)}
            >{(action === 'delete') ? 'Delete' : 'Stop'}</button>
          </ModalFooter>
        </Modal>
        :
        <Modal isOpen={isOpen} onRequestHide={hideModal}>
          <ModalHeader>
            <ModalClose onClick={hideModal}/>
            <ModalTitle>Confirm {(action === 'delete') ? 'Delete' : 'Stop'}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to {(action === 'delete') ? 'delete' : 'stop'} <strong>{app.name}</strong>?</p>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-default" onClick={hideModal}>Cancel</button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              id="cancel-btn"
              onClick={() => (action === 'delete') ? handleAction(appUuid, app.name) : handleAction(appUuid, action)}
            >{(action === 'delete') ? 'Delete' : 'Stop'}</button>
          </ModalFooter>
        </Modal>
    );
  }
}

ActionModal.propTypes = {
  app: PropTypes.object.isRequired,
  handleAction: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  appUuid: PropTypes.string.isRequired,
  affectedModules: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired
};
