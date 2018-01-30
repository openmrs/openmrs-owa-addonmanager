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
import sinon from 'sinon';
import { mount } from 'enzyme';
import AddAddon from '../../app/js/components/manageApps/AddAddon.jsx';


describe('<AddAddon />', () => {
    const spy = sinon.spy();
    const renderedComponent =
        mount(<AddAddon
                files={null}
                handleClear={() => { }}
                handleUpload={() => { }}
                handleDrop={() => { }}
                displayManageOwaButtons={spy} />);

    it('Should render', () => {
        expect(renderedComponent.length).equal(1);
    });

    it('Should have true disableClick initial state', function () {
        expect(renderedComponent.state().disableClick).to.equal(true);
    });

    it('should render drag or click to select message', () => {
        expect(renderedComponent.find('#click-to-select')).to.have.length(1);
    });

    it('should render manage owa buttons', () => {
        expect(spy.calledOnce).to.equal(true);
    })
});
