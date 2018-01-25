import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
} from 'react-modal-bootstrap';

export default class StartErrorModal extends Component {
  render() {
    const {
      isOpen,
      hideMessageModal,
      message,
      app,
    } = this.props;

    return (
      <Modal isOpen={isOpen} onRequestHide={hideMessageModal}>
        <ModalHeader>
          <ModalClose onClick={hideMessageModal} />
          <ModalTitle>
            <span id="msg-modal-title">
              <span className="glyphicon glyphicon-warning-sign" id="error-title-logo" />
              {message}{app.name}
            </span>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>{app.startupErrorMessage}</p>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-default btn-mark-ok"
            onClick={hideMessageModal}>
            Ok
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

StartErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  app: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  hideMessageModal: PropTypes.func.isRequired,
};
