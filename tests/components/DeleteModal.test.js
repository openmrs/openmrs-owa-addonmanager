import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DeleteModal from '../../app/js/components/manageApps/DeleteAddonModal.jsx';

describe('<DeleteModal />', () => {
    const selectedApp = {
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
    };
    const renderedComponent = 
    shallow( < DeleteModal 
        app={selectedApp} 
        handleDelete= {(CohortBuilder) => {}}
        isOpen={true}  
        hideModal= {() => {}}/ > 
        );
    
    it('should render a Modal', () => {
        expect(renderedComponent.find("Modal")).to.have.length(1);
    });

    it('should render a ModalHeader', () => {
        expect(renderedComponent.find("ModalHeader")).to.have.length(1);
    });

    it('should render a ModalClose', () => {
        expect(renderedComponent.find("ModalClose")).to.have.length(1);
    });

    it('should render a ModalTitle', () => {
        expect(renderedComponent.find("ModalTitle")).to.have.length(1);
    });

    it('should render a ModalBody', () => {
        expect(renderedComponent.find("ModalBody")).to.have.length(1);
    });

    it('should render a p tag', () => {
        expect(renderedComponent.find("p")).to.have.length(1);
    });

    it('should render a ModalFooter', () => {
        expect(renderedComponent.find("ModalFooter")).to.have.length(1);
    });

    it('should render a button', () => {
        expect(renderedComponent.find("button")).to.have.length(2);
    });
}); 
