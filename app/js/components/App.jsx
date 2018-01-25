/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React from 'react';
import Header from '../components/common/Header.jsx';
import { StickyContainer, Sticky } from 'react-sticky';
import { ApiHelper } from '../helpers/apiHelper';
import Loader from 'react-loader';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false
    };
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
  }

  componentWillMount(){
    this.checkLoginStatus();
  }

  componentWillReceiveProps(nextProps){
    const routeChanged = nextProps.location !== this.props.location;
    this.setState({routeChanged: routeChanged});
  }

  checkLoginStatus(){
    this.fetchLocation('/v1/session').then((response) => {
      !response.user ?
        location.href = `${location.href.substr(0, location.href.indexOf(location.href.split('/')[4]))}login.htm` :
        this.setState({loggedIn: true, routeChanged: false});
    });
  }

  fetchLocation(url) {
    const apiHelper = new ApiHelper(null);
    return new Promise(function(resolve, reject) {
      apiHelper.get(url).then(response => {
        resolve(response);
      });
    });
  }

  render() {
    const childrenWithExtraProp = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        checkLoginStatus: this.checkLoginStatus
      });
    });

    return (
      <div>
        <Loader loaded={this.state.loggedIn}>
          <StickyContainer>
            <Sticky>
              {
                ({ isSticky,
                  wasSticky,
                  style,
                  distanceFromTop,
                  distanceFromBottom,
                  calculatedHeight }) => {
                  return  <Header style={style} isSticky={isSticky}/>;
                }
              }
            </Sticky>
            <div id="body-wrapper">
              {childrenWithExtraProp}
            </div>
          </StickyContainer>
        </Loader>
      </div>
    );
  }
}