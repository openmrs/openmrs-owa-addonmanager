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
import { hashHistory } from 'react-router';
import { ApiHelper } from '../../helpers/apiHelper';
import BreadCrumbComponent from '../breadCrumb/BreadCrumbComponent';
import axios from 'axios';

const NUMBER_OF_COLUMNS = 3;

export default class Header extends Component {
  constructor(props) {
    super();
    this.state = {
      locationTags: [],
      currentLocationTag: "",
      defaultLocation: "",
      currentUser: "",
      currentLogOutUrl: "",
    };
    this.getUri = this.getUri.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.dropDownMenu = this.dropDownMenu.bind(this);
    this.getLocations = this.getLocations.bind(this);
    this.fetchLocation = this.fetchLocation.bind(this);
    this.getOpenmrsUrl = this.getOpenmrsUrl.bind(this);
    this.setOpenMRSLocation = this.setOpenMRSLocation.bind(this);
    this.logOut = this.logOut.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this)
  }

  componentDidMount() {
    this.getCurrentLocation();

    this.fetchLocation('/v1/location').then((response) => {
      this.setState((prevState, props) => {
        return {
          locationTags: response.results
        };
      });
      this.setState((prevState, props) => {
        return {
          defaultLocation: response.results[0].display,
        };
      });
      this.getUri();
    });

    this.fetchLocation('/v1/session').then((response) => {
      this.setState((prevState, props) => {
        return {
          currentUser: response.user ? response.user.display : ''
        };
      });
    });
  }

  getCurrentLocation() {
    this.fetchLocation('/v1/module').then((response) => {
      if ((response.results.find(module => module.uuid == 'appui')? true : false)) {
        let uploadUrl = this.getOpenmrsUrl()+"/ws/rest/v1/appui/session";
        return this.fetchLocation('/v1/appui/session');
      } else {
        // Use a location that exists with platform
        // see https://issues.openmrs.org/browse/AOM-160
        return this.fetchLocation('/v1/location');
      }
    })
    .then((response) => {
      if (response.sessionLocation) {
        this.setState(() => ({ currentLocationTag: response.sessionLocation.name }));
      } else {
        this.setState(() => ({ currentLocationTag: response.results[0].display }));
      }
    });
  }

  getLocations() {
    return this.state.locationTags.map((location) => {
      return location.display;
    });
  }

  getOpenmrsUrl() {
    let location = window.location.toString();
    let serverLocation = location.substring(0, location.indexOf('/owa/'));
    let last_string = serverLocation
      .substring(serverLocation.lastIndexOf('/') + 1, serverLocation.length)
      .toLowerCase();
    let finallocation = serverLocation;
    let isOpenMRS = last_string.indexOf('openmrs');

    if (isOpenMRS < 0) {
      finallocation = serverLocation.substring(0, serverLocation.lastIndexOf('/'));
    }
    return finallocation;
  }

  getUri() {
    this.state.locationTags.map((location) => {
      let url = location.links[0].uri;
      let arrUrl = url.split("/");
      let applicationInUse = arrUrl[3].search('http:') == -1 ? arrUrl[3] : arrUrl[3].replace('http:', '');
      let customUrl = `/${applicationInUse}/ws/rest/v1/session`;
      this.setState((prevState, props) => {
        return {
          currentLogOutUrl: customUrl
        };
      });
      return customUrl;

    });
  }

  fetchLocation(url) {
    const apiHelper = new ApiHelper(null);
    const getData = new Promise(function(resolve, reject) {
      apiHelper.get(url).then(response => {
        resolve(response);
      });
    });
    return getData;
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      currentLocationTag: e.target.id
    });
    let locationUuid;
    let locationDisplay = e.target.id;
    this.state.locationTags.map((locationArray) => {
      if (locationArray.display === e.target.id) {
        locationUuid = locationArray.uuid;
      }
    });
    this.setOpenMRSLocation(locationUuid, locationDisplay);
  }

  setOpenMRSLocation(locationUuid,locationDisplay) {
    let modulesUrl = this.getOpenmrsUrl()+"/ws/rest/v1/module";
    axios.get(modulesUrl)
      .then(response => {
        if ((response.data.results.find(module => module.uuid == 'appui')? true : false)) {
          let uploadUrl = this.getOpenmrsUrl()+"/ws/rest/v1/appui/session";
          return axios.post(`${uploadUrl}`, {"location" : locationUuid});
        } else {
          // Do nothing for the sake of platform distribution that does not have appui installed
          // see https://issues.openmrs.org/browse/AOM-160
        }
      });
  }

  dropDownMenu(locationTags) {
    const menuDisplay = [];
    const numPerColumn = Math.ceil(locationTags.length / NUMBER_OF_COLUMNS);
    const styles = {
      marginTop: '5px',
      fontSize: '14px',
    };

    for (let cols = 0; cols < NUMBER_OF_COLUMNS; cols++) {
      const menuInColumns = [];
      let colStart = cols * numPerColumn;
      let colEnd = (cols + 1) * numPerColumn;
      for (let menuIndex = colStart; menuIndex < colEnd; menuIndex++) {
        if (locationTags[menuIndex] == this.state.currentLocationTag) {
          menuInColumns.push(
            <a href="#"
              key={menuIndex}
              id={locationTags[menuIndex]}
              style={styles}
              className="current-location text-center location"
              onClick={(e) => {
                e.preventDefault();
                this.handleClick(e);
              }}><span id="current-location">{locationTags[menuIndex]}</span></a>
          );
        } else {
          menuInColumns.push(
            <a href="#"
              key={menuIndex}
              id={locationTags[menuIndex]}
              style={styles}
              className="text-center location"
              onClick={(e) => {
                e.preventDefault();
                this.handleClick(e);
              }}>{locationTags[menuIndex]}</a>
          );
        }
      }
      let filteredMenuInColumns = menuInColumns.filter((item) => item.props.id != undefined);
      menuDisplay.push(
        <li id="location-dropdown" className="col-sm-4" key={cols}>{filteredMenuInColumns}</li>
      );
    }

    return menuDisplay;
  }

  logOut(event){
    axios.delete(this.state.currentLogOutUrl).then((response) => {
      hashHistory.push('/login')
    })
    .catch(error => {
      toastr.error(error.messsage);
  });
}

  render() {
    return (
      <div style={{...this.props.style, zIndex: 1}}>
        <header style={this.props.isSticky ? {borderRadius: "0px"} : null}>
          <div className="logo">
            <a href="../../">
              <img src="img/openmrs-with-title-small.png"/>
            </a>
          </div>

          <ul className="navbar-right nav-header">
            <li className="dropdown">
              <a href="#" role="button" >
                <span className="glyphicon glyphicon-user"/> {' ' + this.state.currentUser + ' '}
              </a>
            </li>
            <li className="dropdown dropdown-large">
              <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                <span className="glyphicon glyphicon glyphicon-map-marker"/> {(this.state.currentLocationTag != "")
                  ? this.state.currentLocationTag + ' '
                  : this.state.defaultLocation + ' '}
                <span className="caret"/>
              </a>
              <ul className="dropdown-menu dropdown-menu-large row">
                {this.dropDownMenu(this.getLocations())}
              </ul>
            </li>
            <li>
              <a onClick={(event) => this.logOut(event)}>Logout {' '}
                <span className="glyphicon glyphicon-log-out"/></a>
            </li>
          </ul>
        </header>
        <BreadCrumbComponent />
      </div>
    );
  }
}
