import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ManageApps from '../../app/js/components/homePage/manageApps/ManageApps';
import BreadCrumbComponent from '../../app/js/components/breadCrumb/BreadCrumbComponent';
import AddonList from '../../app/js/components/homePage/manageApps/AddonList';

describe('<ManageApps />', () => {
    const renderedComponent = shallow(< ManageApps />);

    it('Should render 4 div', () => {
        expect(renderedComponent.find("div")).to.have.length(4);
    });

    it('Should render a table', () => {
        expect(renderedComponent.find("table")).to.have.length(1);
    });

    it('Should render a table row', () => {
        expect(renderedComponent.find("tr")).to.have.length(1);
    });

    it('Should render 5 table head', () => {
        expect(renderedComponent.find("th")).to.have.length(5);
    });

    it('Should render a heading', () => {
        expect(renderedComponent.find("h3")).to.have.length(1);
        expect(renderedComponent.find("h3").getNode()
          .props.children).to.equal('Addon Manager');
    });

    it('Should render 5 table head titles', () => {
        expect(renderedComponent.find("th").getNodes()[0]
            .props.children).to.equal('Logo');
        expect(renderedComponent.find("th").getNodes()[1]
            .props.children).to.equal('Name');
        expect(renderedComponent.find("th").getNodes()[2]
            .props.children).to.equal('Developer');
        expect(renderedComponent.find("th").getNodes()[3]
            .props.children).to.equal('Version');
        expect(renderedComponent.find("th").getNodes()[4]
            .props.children).to.equal('Delete');
    });

    it('should mount the BreadCrumbComponent in itself', () => {
        expect(renderedComponent.contains( <BreadCrumbComponent /> )).to.equal(true);
    });

    it('should mount the AddonList component in itself', () => {
        expect(renderedComponent.contains( <AddonList /> )).to.equal(true);
    });
});
