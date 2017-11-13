import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Addon from '../../app/js/components/manageApps/Addon.jsx';

describe('<Addon />', () => {
    let component;

    beforeEach(() => {
        component = shallow(<Addon />);
    });

    it('should render', () => {
        expect(component).to.exist;
    });

    it('should have the correct initial state', () => {
        expect(component.instance().state.action).to.equal(null);
        expect(component.instance().state.starting).to.equal(false);
        expect(component.instance().state.stopping).to.equal(false);
        expect(component.instance().state.isOpen).to.equal(false);
    });

    it('should have addon class', () => {
        expect(component.hasClass('addon')).to.equal(true);
    });

    it('should render a table', () => {
        expect(component.find('table')).to.have.length(1);
    });
});