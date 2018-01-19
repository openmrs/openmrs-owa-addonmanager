/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import Help from '../../app/js/components/manageApps/Help';

describe('<Help />', () => {
  const renderedComponent = shallow(<Help checkLoginStatus={() => {}} />);

  it('should render its children', () => {
    expect(renderedComponent.find("div")).to.have.length(4)
    expect(renderedComponent.find("h2")).to.have.length(1)
    expect(renderedComponent.find("img")).to.have.length(6)
    expect(renderedComponent.find("h2")).to.have.length(1)
    expect(renderedComponent.find("p")).to.have.length(10)
    expect(renderedComponent.find("fieldset")).to.have.length(1)
    expect(renderedComponent.find("legend")).to.have.length(1)
  })

  it('should have initial state', () => {
    expect(renderedComponent.state().AppBaseURLValue).equal('/owa');
    expect(renderedComponent.state().AppFolderPathValue).equal('appdata\\owa');
    expect(renderedComponent.state().AppStoreURLValue).equal('http://modules.openmrs.org');
  })

  it('should have all the method in the component to be defined', () => {
    renderedComponent.instance().componentWillMount();
    renderedComponent.instance().onChange(event);
    renderedComponent.instance().getDefaultSettings()
    renderedComponent.instance().setDefault()
  })  
})