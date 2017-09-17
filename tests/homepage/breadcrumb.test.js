import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import BreadCrumbComponent from '../../app/js/components/breadCrumb/breadCrumbComponent';

describe('<BreadCrumbComponent />', () => {
    const breadCrumb = shallow( < BreadCrumbComponent />);
    breadCrumb.setState({ 
      manageSettingsPage: true,
      manageAddonPage: true,
      homePage: true 
    });

    it('Should render 1 div', () => {
        expect(breadCrumb.find("div")).to.have.length(1);
    });
    
    it('Should render 1 anchor tag', () => {
        expect(breadCrumb.find("a")).to.have.length(1);
    });

    it('Should render a 7 spans', () => {
        expect(breadCrumb.find("span")).to.have.length(7);
    });

    it('Should render a `Add-On Manager` in a span', () => {
        expect(breadCrumb.find("span").getNodes()[2].props.children.props.children).equals("Add-On Manager");
    });

    it('Should render a `Manage app` in a span', () => {
        expect(breadCrumb.find("span").getNodes()[4].props.children.props.children).equals("Manage addon");
    });

    it('Should render a `Settings` in a span', () => {
        expect(breadCrumb.find("span").getNodes()[6].props.children.props.children).equals("Settings");
    });

    it('Should have a 3 Links', () => {
        expect(breadCrumb.find("Link")).to.have.length(3);
    });

    it('Should have a link that links to the `/` route', () => {
        expect(breadCrumb.find("Link").getNodes()[0].props.to).equals("/");
    });

    it('Should have a link that links to the `/manageApps` route', () => {
        expect(breadCrumb.find("Link").getNodes()[1].props.to).equals("manageApps");
    });

    it('Should have a link that links to the `/manageSettings` route', () => {
        expect(breadCrumb.find("Link").getNodes()[2].props.to).equals("manageSettings");
    });
});
