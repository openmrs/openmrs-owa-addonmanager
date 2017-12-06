import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter } from 'react-modal-bootstrap';

const ModuleClickAlert = ({ isOpenAlert, handleAlert }) => {
  return (
    <Modal isOpen={isOpenAlert} onRequestHide={handleAlert}>
      <ModalHeader>
        <ModalClose onClick={handleAlert}/>
        <ModalTitle >
          <span id="msg-modal-title" >
            Could not redirect
          </span>
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p>Sorry, you clicked a module which does not have a user interface</p>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-default btn-mark-ok" onClick={handleAlert}>OK</button>
      </ModalFooter>
    </Modal>
  );
};

export default ModuleClickAlert;

ModuleClickAlert.propTypes = {
  isOpenAlert: React.PropTypes.bool.isRequired,
  handleAlert: React.PropTypes.func.isRequired
};
