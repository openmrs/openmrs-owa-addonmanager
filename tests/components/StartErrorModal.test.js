import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import StartErrorModal from '../../app/js/components/manageApps/StartErrorModal.jsx';

describe('<StartErrorModal />', () => {
  const app =
  {
    "appDetails":
    {
      "version": "0.1.0",
      "name": "openmrs-addOnManager",
      "description": "This will help in uploading the openmrs open web apps and omod files",
      "icons":
      {
        "16": null,
        "48": "/img/omrs-button.png",
        "128": null,
      },
      "developer":
      {
        "url": "https://github.com/openmrs/openmrs-owa-addonmanager",
        "name": "andela-pupendo,kingisaac95, andela-wanjikum, andela-jomadoye",
        "company": null,
        "email": null,
      },
      "activities":
      {
        "openmrs":
        {
          "href": "*",
        }
      },
      "folderName": "openmrs-addonmanager",
      "baseUrl": null,
      "launchUrl": null,
      "launch_path": "index.html",
      "installs_allowed_from": null,
      "default_locale": "en",
      "deployed.owa.name": null,
    }
    , "appType": "module",
    "install": false,
  }
  
  const renderedComponent =
  shallow(<StartErrorModal
    app={app}
    isOpen={true}
    hideMsgModal={() => { }}/>);
    
    it('Should render 2 spans on initial render', () => {
      expect(renderedComponent.find("span")).to.have.length(2);
    });
    
    it('should render a Modal', () => {
      expect(renderedComponent.find('Modal')).to.have.length(1);
    });
    
    it('should render a Modal Header', () => {
      expect(renderedComponent.find('ModalHeader')).to.have.length(1);
    });
    
    it('should render a Modal Footer', () => {
      expect(renderedComponent.find('ModalFooter')).to.have.length(1);
    });
    
    it('should render a Modal Close', () => {
      expect(renderedComponent.find('ModalClose')).to.have.length(1);
    })
    
    it('should render a Modal Title', () => {
      expect(renderedComponent.find('ModalTitle')).to.have.length(1);
    })
    
    it('should render a Modal Body', () => {
      expect(renderedComponent.find('ModalBody')).to.have.length(1);
    });
    
    it('should render a p tag', () => {
      expect(renderedComponent.find('p')).to.have.length(1);
    });
    
    it('should render a button', () => {
      expect(renderedComponent.find('button')).to.have.length(1);
    })
  });
  