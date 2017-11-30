import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { AddonList } from '../../app/js/components/manageApps/AddonList.jsx';


describe('<AddonList />', () => {
    const appList = [{
        appDetails: {
            "version": "1.0.0",
            "name": "CohortBuilder",
            "description": "modern refresh of the OpenMRS Cohort Builder tool",
            "icons": {
                "16": null,
                "48": "/img/omrs-button.png",
                "128": null
            },
            "developer": {
                "url": "https://github.com/openmrs/openmrs-owa-cohortbuilder",
                "name": "andela-odaniel, wanjikum, andela-jomadoye, andela-pupendo, kingisaac95",
                "company": null,
                "email": null
            },
            "activities": {
                "openmrs": {
                    "href": "*"
                }
            },
            "folderName": "cohortbuilder",
            "baseUrl": null,
            "launchUrl": null,
            "launch_path": "index.html",
            "installs_allowed_from": null,
            "default_locale": "en",
            "deployed.owa.name": null
        },
        install: false
    }];

    const addonList = [];
    const searchedAddons = [];
    const openPage = () => { };
    const openModal = () => { };
    const handleDownload = () => { };
    const getInstalled = () => { };
    const testAddonList = mount(
        <AddonList
            addonList={appList}
            searchedAddons={searchedAddons}
            openPage={openPage}
            openModal={openModal}
            handleDownload={handleDownload}
            getInstalled={getInstalled} />);

    it('should render a tbody', () => {
        expect(testAddonList.find("tbody")).to.have.length(1);
    });

    it('should render a tr tag', () => {
        expect(testAddonList.find("tr")).to.have.length(1);
    });

    it('should render td tag', () => {
        expect(testAddonList.find("td")).to.have.length(5);
    });

    it('should render div tags', () => {
        expect(testAddonList.find("div")).to.have.length(3);
    });

    it('should render a h2 tag', () => {
        expect(testAddonList.find("h5")).to.have.length(1);
    });

    it('should render a image tag', () => {
        expect(testAddonList.find("img")).to.have.length(1);
    });
});
