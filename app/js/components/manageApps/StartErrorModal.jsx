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
      hideMsgModal,
      message,
      app,
    } = this.props;

    return (
      <Modal isOpen={isOpen} onRequestHide={hideMsgModal}>
        <ModalHeader>
          <ModalClose onClick={hideMsgModal} />
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
            onClick={hideMsgModal}>
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
  hideMsgModal: PropTypes.func.isRequired,
};
