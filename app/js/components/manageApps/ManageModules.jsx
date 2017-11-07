import React, { Component } from 'react';
import axios from 'axios';

class ManageModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      installedModules: [],
      action: null,
      stopping: false,
      starting: false,
    };
    this.handleAction = this.handleAction.bind(this);
    this.actionRunning = this.actionRunning.bind(this);
  }

  componentWillMount() {
    this.fetchModules();
  }

  fetchModules() {
    let installedModules;
    const applicationDistribution = location.href.split('/')[2];
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    this.requestUrl = '/v1/module/?v=full';
    axios.get(`https:/${apiBaseUrl}${this.requestUrl}`).then(response => {
      this.setState({
        installedModules: response.data.results,
      });
    }).catch((error) => {
      return error;
    });

  }

  handleAction(event, moduleUuid, action, allModules = false) {
    event.preventDefault();
    if (action === 'stop') {
      this.setState({
        stopping: true
      });
    }else if(action === 'start'){
      this.setState({
        starting: true
      });
    }
    
    const applicationDistribution = location.href.split('/')[2];
    const url = location.href.split('/')[3];
    const apiBaseUrl = `/${applicationDistribution}/${url}/ws/rest`;
    this.requestUrl = '/v1/moduleaction';
    let postData = {};

    if (moduleUuid != null) {
      postData = {
        "action": action,
        "modules": [moduleUuid],
      };
    } else {
      postData = {
        "action": action,
        "allModules": allModules.toString()
      };
    }

    axios.post(`https:/${apiBaseUrl}${this.requestUrl}`, postData).then(response => {
      this.setState({
        stopping: false,
        starting: false,
      });
      this.fetchModules();
    }).catch(
      (error) => {
        return error;
      }
    );
  }

  actionRunning() {
    if (this.state.stopping === true) {
      return (<div className="happening"><p className="upload-text">Stopping Module</p></div>)
    }else if(this.state.starting === true){
      return (<div className="happening"><p className="upload-text">Starting Module</p></div>)
    }
  }

  render() {
    let installedModulesList = this.state.installedModules.map((installedModule) => {
      <li key={installedModule.uuid}>{installedModule.name}</li>;
    });
    return (
      <div className="container-fluid manage-modules">
        <h3>Manage modules</h3>
        <button
          id="startall-modules-btn"
          className="btn btn-secondary"
          onClick={(e) => this.handleAction(e, null, "start", true)}
        >
          <span className="glyphicon glyphicon-play" />
          Start All
        </button>
        <table id="modules-table" className="table table-striped table-bordered">
          <tbody>
            <tr id="table-header"><th>Name</th><th>Description</th><th>Version</th><th>Author</th>
              <th>Action</th><th>Status</th></tr>
            {
              this.state.installedModules.map((installedModule) => {
                return (
                  <tr key={installedModule.uuid}>
                    <td><strong>{installedModule.name}</strong></td>
                    <td className="module-description">{installedModule.description}</td>
                    <td>{installedModule.version}</td>
                    <td>{installedModule.author}</td>
                    <td className="module-action-cell">
                      {
                        installedModule.started === false ?
                          <button
                            type="button"
                            className="btn btn-default btn-sm"
                            onClick={(event) => { this.handleAction(event, installedModule.uuid, "start") }}
                          >
                            <span id="start-module" className="glyphicon glyphicon-play" /> Start
                          </button>
                          :
                          <button
                            type="button"
                            className="btn btn-default btn-sm"
                            onClick={(event) => this.handleAction(event, installedModule.uuid, "stop")}
                          >
                            <span id="stop-module" className="glyphicon glyphicon-stop" /> Stop
                          </button>
                      }
                    </td>
                    <td id="status-cell">
                      {
                        installedModule.started === true ?
                          <span className="glyphicon glyphicon-ok" />
                          :
                          <span className="glyphicon glyphicon-stop" />
                      }
                    </td>
                  </tr>
                );

              })
            }
          </tbody>
        </table>
        {
          this.actionRunning()
        }
      </div>
    );
  }
}

export default ManageModules;