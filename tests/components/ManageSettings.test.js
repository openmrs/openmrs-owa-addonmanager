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
import { shallow } from 'enzyme';
import  ManageSettings  from '../../app/js/components/manageApps/ManageSettings.jsx';

describe('<ManageSettings />', () => {
    const renderedComponent = shallow( < ManageSettings checkLoginStatus={() => {}} /> );
    it('Should render a Form', () => {
        expect(renderedComponent.find("form")).to.have.length(1);
    });

    it('Should render a FieldSet', () => {
        expect(renderedComponent.find("fieldset")).to.have.length(1);
    });

    it('Should render 3 Labels', () => {
        expect(renderedComponent.find("label")).to.have.length(3);
        expect(renderedComponent.find("label").getNodes()[0].props.children).equals('App Base URL:');
        expect(renderedComponent.find("label").getNodes()[1].props.children).equals('App Folder Path:');
        expect(renderedComponent.find("label").getNodes()[2].props.children).equals('App Store URL:');
    });

    it('Should render 3 input fields', () => {
        expect(renderedComponent.find("input")).to.have.length(3);
    });

    it('Should render H6 tags', () => {
        expect(renderedComponent.find("h6")).to.have.length(3);
        expect(renderedComponent.find("h6").getNodes()[0].props.children).equals('The base URL from where the Open Web Apps are hosted');
        expect(renderedComponent.find("h6").getNodes()[1].props.children).equals('The default location where the apps are stored on disk');
        expect(renderedComponent.find("h6").getNodes()[2].props.children).equals('The default URL for the OpenMRS appstore');
    });

    it('Should render a Legend with text of `Manage OWA Settings`', () => {
        expect(renderedComponent.find("legend")).to.have.length(1);
        expect(renderedComponent.find("legend").props().children).equals('Manage OWA Settings');
    });
});
