import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import  { AddonList }  from '../../app/js/components/manageApps/AddonList.jsx';


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

    const openPage = () => {};
    const openModal = () => {};
    const addonList = mount( <AddonList appList={appList} openPage={openPage}  openModal={openModal}/ > );
    
    it('should render a tbody', () => {
        expect(addonList.find("tbody")).to.have.length(1);
    });
    
    it('should render a tr tag', () => {
        expect(addonList.find("tr")).to.have.length(1);
    });
    
    it('should render td tag', () => {
        expect(addonList.find("td")).to.have.length(5);
    });
    
    it('should render div tags', () => {
        expect(addonList.find("div")).to.have.length(2);
    });

    it('should render a h2 tag', () => {
        expect(addonList.find("h5")).to.have.length(1);
    });

    it('should render a image tag', () => {
        expect(addonList.find("img")).to.have.length(1);
    });
});