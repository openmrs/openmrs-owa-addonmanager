import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import axios from 'axios';
import { Form, Button, FormControl, FormGroup, Col, ControlLabel, Checkbox, Nav, Modal } from 'react-bootstrap';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      show: false
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose() {
    this.setState({ show: false });
  }
  handleShow() {
    this.setState({ show: true });
  }

  handleLogin(event) {
    event.preventDefault();
    const { username, password } = this.state;
    const applicationDistribution = location.href.split('/')[2];
    const urlPrefix = location.href.substr(0, location.href.indexOf('//'));
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    const requestUrl = 'v1/session';
    const auth = 'Basic ' + new Buffer(`${username}:${password}`).toString('base64');

    axios({
      url: `${urlPrefix}/${apiBaseUrl}/${requestUrl}`,
      method: 'GET',
      headers: {
        'Authorization': auth
      }
    }).then(response => {
      (response.data.authenticated) ? hashHistory.push('/') : toastr.error('Invalid username or password');
    })
      .catch(error => {
        toastr.error(error.message);
      });
  }

  render() {
    return (
      <div className="well">
        <a href="../../">
          <img src="img/openmrs-with-title-small.png" />
        </a>
        <div className='form-group'>
          <Form className='material-form' onSubmit={(event) => this.handleLogin(event)}>
            <FormGroup controlId="formHorizontalUsername">
              <FormControl
                input type="text"
                placeholder="Username"
                onChange={event => this.setState({ username: event.target.value })}
              />
            </FormGroup>
            <FormGroup controlId="formHorizontalPassword">
              <FormControl
                input type="password"
                placeholder="Password"
                floatingLabelText="Password"
                onChange={(event) => this.setState({ password: event.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Button className="btn-login btn-primary btn-lg"
                type="submit"
              >Log in</Button>
            </FormGroup>
            <p className="helper-text">Having trouble logging in? <a className="signinHelp" onClick={(event) => this.handleShow} >Click here</a> for help.</p>
            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>OpenMRS login</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Please contact the system administrator for more information
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={(event) => this.handleClose}>Close</Button>
              </Modal.Footer>
            </Modal>
          </Form >
        </div>
      </div>
    );
  }
}

export default Login;