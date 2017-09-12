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
import  AddAddon  from '../../app/js/components/homePage/manageApps/AddAddon.jsx';


describe('<AddAddon />', () => {
    const renderedComponent = 
    shallow( < AddAddon 
        handleClear={() => {}} 
        handleUpload={() => {}} / > );
    
    it('Should render a file input', () => {
        expect(renderedComponent.find("input")).to.have.length(1);
    });

    it('Should render a FieldSet', () => {
        expect(renderedComponent.find("fieldset")).to.have.length(1);
    });

    it('Should render 2 buttons', () => {
        expect(renderedComponent.find("button")).to.have.length(2);
        expect(renderedComponent.find("button")
          .getNodes()[0]
          .props.children[1])
          .equals(' Upload');
        expect(renderedComponent.find("button")
          .getNodes()[1]
          .props.children[1])
          .equals(' Clear Addon');
    });

    it('Should render 2 buttons with upload and delete glyphicons', () => {
        expect(renderedComponent.find("button")).to.have.length(2);
        expect(renderedComponent.find("button")
          .getNodes()[0].props
          .children[0].props.className)
          .equals('glyphicon glyphicon-upload');
          
        expect(renderedComponent.find("button")
          .getNodes()[1].props
          .children[0].props.className)
          .equals('glyphicon glyphicon-remove');
    });

    it('Should render 2 span fields', () => {
        expect(renderedComponent.find("span")).to.have.length(2);
    });

    it('Should render a Legend with text of `Upload Addon Package:`', () => {
        expect(renderedComponent.find("legend")).to.have.length(1);
        expect(renderedComponent.find("legend")
          .props().children)
          .equals('Upload Addon Package:');
    });

});
