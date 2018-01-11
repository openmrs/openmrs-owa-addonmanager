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
import App from '../../app/js/components/App.jsx';
import Loader from 'react-loader';
import { StickyContainer, Sticky } from 'react-sticky';


describe('<App />', () => {

    it('should test that App renders correctly', () => {
        const wrapper = shallow( <App/>)
        expect(wrapper.find("div")).to.have.length(2);
    });
});
