/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React, { Component } from 'react';
import ManageApps from '../components/manageApps/ManageApps.jsx';
import Header from '../components/common/Header.jsx';
import { StickyContainer, Sticky } from 'react-sticky';

export default class App extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        <StickyContainer>
          <Sticky>
            {
              ({ isSticky,
                wasSticky,
                style,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight }) => {
                return  <Header style={style} isSticky={isSticky}/>
              }
            }
          </Sticky>
          <div id="body-wrapper">
            {this.props.children}
          </div>
        </StickyContainer>
      </div>
    );
  }
}
