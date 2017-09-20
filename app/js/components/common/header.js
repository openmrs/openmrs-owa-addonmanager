/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {Component} from 'react';
import {Link, IndexLink} from 'react-router';
import {ApiHelper} from '../../helpers/apiHelper';

const NUMBER_OF_COLUMNS = 3;

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      locationTags: [],
      currentLocationTag: "",
      defaultLocation: "",
      currentUser: "",
      currentLogOutUrl: "",
    };
    this.getUri = this.getUri.bind(this);
  }

  componentWillMount() {
    this.fetchLocation('/location').then((response) => {
      this.setState({locationTags: response.results});
      this.setState({
        defaultLocation: response.results[0].display,
        currentLocationTag: response.results[0].display,
      });
      this.getUri();
    });

    this.fetchLocation('/session').then((response) => {
      this.setState({currentUser: response.user.display});
    });
  }

  getLocations() {
    return this.state.locationTags.map((location) => {
      return location.display;
    });
  }

  getUri() {
    this.state.locationTags.map((location) => {
      let url = location.links[0].uri;
      let arrUrl = url.split("/");
      let applicationInUse = arrUrl[3].search('http:') == -1 ? arrUrl[3]: arrUrl[3].replace('http:', '');
      let customUrl = `/${applicationInUse}/appui/header/logout.action?successUrl=${applicationInUse}`;
      this.setState({currentLogOutUrl: customUrl});
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
    this.setState({currentLocationTag: e.target.id});
  }

  dropDownMenu(locationTags) {
    const menuDisplay = [];
    const numPerColumn = Math.ceil(locationTags.length / NUMBER_OF_COLUMNS);
    for (let cols = 0; cols < NUMBER_OF_COLUMNS; cols++) {
      const menuInColumns = [];
      let colStart = cols * numPerColumn;
      let colEnd = (cols + 1) * numPerColumn;
      for (let menuIndex = colStart; menuIndex < colEnd; menuIndex++) {
        if (locationTags[menuIndex] == this.state.currentLocationTag) {
          menuInColumns.push(
            <a href="#" key={menuIndex} id={locationTags[menuIndex]}
              className="current-location text-center location"
              onClick={(e) => {
                e.preventDefault();
                this.handleClick(e);
              }}>{locationTags[menuIndex]}</a>
          );
        } else {
          menuInColumns.push(
            <a href="#" key={menuIndex} id={locationTags[menuIndex]}
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
        <li className="col-sm-4" key={cols}>{filteredMenuInColumns}</li>
      );
    }

    return menuDisplay;
  }

  render() {
    return (
      <header>
        <div className="logo">
          <a href="../../">
            <img src="img/openmrs-with-title-small.png"/>
          </a>
        </div>

        <ul className="navbar-right nav-header">
          <Link to="" activeClassName="active" className="">
            <li className="dropdown">
              <a 
                id="jed"
                className="dropdown-toggle navbar-font" 
                data-toggle="dropdown" 
                href="#" role="button" 
                aria-haspopup="true" 
                aria-expanded="false">
                <span className="glyphicon glyphicon-user navbar-glyphicon-font"/> {' ' + this.state.currentUser}
                <span className="caret navbar-glyphicon-font"/>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a 
                    className="my-account text-center"
                    href="#">My Account</a>
                </li>
              </ul>
            </li>
          </Link>

          <Link to="" activeClassName="active">
            <li className="dropdown dropdown-large">
              <a 
                className="dropdown-toggle navbar-font" 
                data-toggle="dropdown" 
                href="#" 
                role="button" 
                aria-haspopup="true" 
                aria-expanded="false">
                <span className="glyphicon glyphicon glyphicon-map-marker navbar-glyphicon-font"/> {(this.state.currentLocationTag != "")
                  ? this.state.currentLocationTag
                  : this.state.defaultLocation}
                <span className="caret navbar-glyphicon-font"/>
              </a>
              <ul className="dropdown-menu dropdown-menu-large row">
                {/*Execute the function*/}
                {this.dropDownMenu(this.getLocations())}
              </ul>
            </li>
          </Link>

          <Link to="" activeClassName="active">
            <li>
              <a 
                className="navbar-font"
                href={this.state.currentLogOutUrl}>Logout {' '}
                <span className="glyphicon glyphicon-log-out navbar-glyphicon-font"/></a>
            </li>
          </Link>
        </ul>
      </header>
    );
  }
}

