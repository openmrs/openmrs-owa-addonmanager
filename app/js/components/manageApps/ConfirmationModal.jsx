import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

export const ConfirmationModal = ({
  isOpen,
  upgradeVersion,
  confirmUpgrade,
  dismissUpgradeModal,
  addon,
}) => {

  return (
    <Modal isOpen={isOpen} onRequestHide={dismissUpgradeModal}>
      <ModalHeader>
        <ModalClose onClick={dismissUpgradeModal} />
        <ModalTitle>
          <span className="embolden">
            Upgrade Confirmation
          </span>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p>Confirm upgrade of
          <span className="embolden"> {addon && addon.appDetails.name} </span>
          from version
          <span className="embolden"> {addon && addon.appDetails.version} </span>
          to
          <span className="embolden"> {upgradeVersion} </span>
        </p>
      </ModalBody>
      <ModalFooter>
        <button
          className="btn btn-default btn-mark-ok"
          onClick={confirmUpgrade}>
          Confirm
        </button>
        <button
          className="btn btn-default btn-mark-ok"
          onClick={dismissUpgradeModal}>
          Cancel
        </button>
      </ModalFooter>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  addon: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  upgradeVersion: PropTypes.string.isRequired,
  confirmUpgrade: PropTypes.func.isRequired,
  dismissUpgradeModal: PropTypes.func.isRequired,
};
