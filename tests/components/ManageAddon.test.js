import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ManageApps from '../../app/js/components/manageApps/ManageApps.jsx';
import BreadCrumbComponent from '../../app/js/components/breadCrumb/BreadCrumbComponent.jsx';
import AddonList from '../../app/js/components/manageApps/AddonList.jsx';
import AddAddon from '../../app/js/components/manageApps/AddAddon.jsx';

describe('<ManageApps />', () => {
    const renderedComponent = shallow(< ManageApps checkLoginStatus={() => {}} />);

    // simulate a selected file in order to render upload and clear buttons
    renderedComponent.setState({
        isSearched: true,
        files: [{
            name: "test.zip",
            type: "application/zip"
        }]
    });

    it('Should render 9 divs on initial render', () => {
        expect(renderedComponent.find("div")).to.have.length(9);
    });

    it('Should render a table', () => {
        expect(renderedComponent.find("table")).to.have.length(1);
    });

    it('Should render two table rows', () => {
        expect(renderedComponent.find("tr")).to.have.length(2);
    });

    it('Should render 6 table head', () => {
        expect(renderedComponent.find("th")).to.have.length(6);
    });

    it('Should render a heading', () => {
        expect(renderedComponent.find("h2")).to.have.length(1);
        expect(renderedComponent.find("h2").getNode()
          .props.children).to.equal('Add-On Manager');
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
            .props.children).to.equal('Action');
    });

    it('should mount the AddonList component in itself', () => {
        expect(renderedComponent.contains( <AddonList /> )).to.equal(true);
    });

    it('should mount the AddAddon component in itself', () => {
        expect(renderedComponent.find("AddAddon")).to.have.length(1);
    });
    
    it('Should render clear and upload buttons when file is selected', () => {
        const AddAddon = renderedComponent.find("AddAddon").first();
        expect(AddAddon.find("#upload-btn").first().length).to.equal(1);
        expect(AddAddon.find("#clear-btn").first().length).to.equal(1);
    });

    it('Should add selected file name when file is selected', () => {
        const AddAddon = renderedComponent.find("AddAddon").first();
        expect(AddAddon.html()).to.contain('test.zip');
    });
});
