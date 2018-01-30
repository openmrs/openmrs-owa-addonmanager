import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub } from 'sinon';
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
    },
     {"appDetails":
       {
         "uuid":"atlas",
         "display":"Atlas Module",
         "name":"Atlas Module",
         "description":"The Atlas Module provides a mechanism for an implementation to create and manage a bubble on the\n\t\tOpenMRS Atlas (https://atlas.openmrs.org) directly from their OpenMRS server.",
         "packageName":"org.openmrs.module.atlas",
         "author":"Victor Chircu",
         "version":"2.2",
         "started":true,
         "startupErrorMessage":null,
         "requireOpenmrsVersion":"1.7.4",
         "awareOfModules":["org.openmrs.module.legacyui"],
         "requiredModules":["org.openmrs.module.uiframework"],
         "developer": {
            "url": "https://github.com/openmrs/openmrs-owa-cohortbuilder",
            "name": "andela-odaniel, wanjikum, andela-jomadoye, andela-pupendo, kingisaac95",
            "company": null,
            "email": null
        },
         "links":[
           {
             "rel":"ref",
             "uri":"http://localhost:8081/openmrs-standalone/ws/rest/v1/module/atlas?v=ref"},
           {
             "rel":"action",
             "uri":"http://localhost:8081/openmrs-standalone/ws/rest/v1/moduleaction"},
           {
             "rel":"self",
             "uri":"http://localhost:8081/openmrs-standalone/ws/rest/v1/module/atlas"}],
         "resourceVersion":"1.8"
       },
       "appType":"module",
       "install":false
     }
  ];


    const addonList = [];
    const searchedAddons = [];
    const openPage = () => { };
    const openModal = () => { };
    const handleDownload = () => { };
    const getInstalledall = () => { };
    const handleUserClick = () => { };
    const handleInstall = () => { };
    const handleUpgrade = () => { };
    const getInstalled = () => { };
    const getInstalledStub = stub().onCall(0).returns({'modules':[], 'owas':[]});
    const testAddonList = mount(
        <AddonList
            addonList={appList}
            searchedAddons={searchedAddons}
            openPage={openPage}
            openModal={openModal}
            handleDownload={handleDownload}
            handleUserClick={handleUserClick}
            handleInstall={handleInstall}
            handleUpgrade={handleUpgrade}
            getInstalled={getInstalled} />);

    const searchedAddonslist = mount(
        <AddonList
            addonList={appList}
            searchedAddons={appList}
            openPage={openPage}
            openModal={openModal}
            handleDownload={handleDownload}
            handleUserClick={handleUserClick}
            handleInstall={handleInstall}
            handleUpgrade={handleUpgrade}
            getInstalled={getInstalledStub} />);

    it('should render a tbody', () => {
        expect(testAddonList.find("tbody")).to.have.length(1);
        expect(searchedAddonslist.find("tbody")).to.have.length(1);
    });

    it('should render a tr tag', () => {
        expect(testAddonList.find("tr")).to.have.length(2);
        expect(searchedAddonslist.find("tr")).to.have.length(2);
    });

    it('should render td tag', () => {
        expect(testAddonList.find("td")).to.have.length(8);
        expect(searchedAddonslist.find("td")).to.have.length(8);
    });

    it('should render a h2 tag', () => {
        expect(testAddonList.find("h5")).to.have.length(2);
        expect(searchedAddonslist.find("h5")).to.have.length(2);
    });
    
    it('should render child table correctly', () => {
        expect(testAddonList.find('tbody').children()).to.have.length(appList.length);
        expect(searchedAddonslist.find('tbody').children()).to.have.length(appList.length);
    });
});
