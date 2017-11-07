import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import ManageModules from '../../app/js/components/manageApps/ManageModules.jsx';

describe('<ManageModules />', () => {
    let component;

    beforeEach(() => {
        component = shallow(<ManageModules> </ManageModules>);
    });

    it('should render', () => {
        expect(component).to.exist;
    });

    it('should have the correct initial state', () => {
        expect(component.instance().state.action).to.equal(null);
        expect(component.instance().state.installedModules.length).to.equal(0);
    });

    it('should have manage-modules class', () => {
        expect(component.hasClass('manage-modules')).to.equal(true);
    });

    it('should display correct header text', () => {
        expect(component.find('h3').text()).to.contain('Manage modules');
    });

    it('should render a table', () => {
        expect(component.find('table')).to.have.length(1);
    });

    it('should have a start all button', () => {
        expect(component.find('button').text('Start All')).to.contain('Start All');
    });
});