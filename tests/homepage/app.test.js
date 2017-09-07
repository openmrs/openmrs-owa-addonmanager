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
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import App from '../../app/js/components/App';
import Header from '../../app/js/components/common/header';
import BreadCrumbComponent from '../../app/js/components/breadCrumb/breadCrumbComponent';
import HomePage from '../../app/js/components/homePage/homePage';

describe('<App />', () => {

    it('should mount the BreadCrumbComponent in itself', () => {
        const wrapper = shallow( <App/> )
        expect(wrapper.contains( <BreadCrumbComponent/> )).to.equal(true);
    });

    it('should mount the Header in itself', () => {
        const wrapper = shallow( <App/> )
        expect(wrapper.contains( <Header/> )).to.equal(true);
    });
});