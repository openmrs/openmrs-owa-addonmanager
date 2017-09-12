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