import React from 'react';

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter, } from 'react-modal-bootstrap';

const InvalidZipUploadModal = ({ isOpen, hideModal }) => {
  return (
    <Modal isOpen={isOpen} onRequestHide={hideModal}>
      <ModalHeader>
        <ModalClose onClick={hideModal}/>
        <ModalTitle>Invalid Zip File</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p>Could not successfully upload the file. The file should be a valid module</p>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-default" onClick={hideModal}>OK</button>
      </ModalFooter>
    </Modal> 
  );
};

export default InvalidZipUploadModal;

InvalidZipUploadModal.propTypes = {
  isOpen: React.PropTypes.bool.isRequired,
  hideModal: React.PropTypes.func.isRequired,
};
