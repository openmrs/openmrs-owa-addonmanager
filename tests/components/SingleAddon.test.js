import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SingleAddon from '../../app/js/components/manageApps/SingleAddon';


describe('<SingleAddon/>', () => {

  const owa =
    {"appDetails":
      {
        "version":"0.1.0",
        "name":"openmrs-addOnManager",
        "description":"This will help in uploading the openmrs open web apps and omod files",
        "icons":
          {
            "16":null,
            "48":"/img/omrs-button.png",
            "128":null,
          },
        "developer":
          {
            "url":"https://github.com/openmrs/openmrs-owa-addonmanager",
            "name":"andela-pupendo,kingisaac95, andela-wanjikum, andela-jomadoye",
            "company":null,
            "email":null,
          },
        "activities":
          {
            "openmrs":
              {
                "href":"*",
              }
          },
        "folderName":"openmrs-addonmanager",
        "baseUrl":null,
        "launchUrl":null,
        "launch_path":"index.html",
        "installs_allowed_from":null,
        "default_locale":"en",
        "deployed.owa.name":null,
      }
      ,"appType":"owa",
      "install":false,
    };

  const module =
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
            "url":"https://github.com/openmrs/openmrs-owa-addonmanager",
            "name":"andela-pupendo, kingisaac95, andela-wanjikum, andela-jomadoye",
            "company":null,
            "email":null,
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
    };

  let addonComponent =
    shallow(<SingleAddon
            app={owa}
            addonParam={() => {}}
            updatesVersion={{}} />);

  it('Should render', () => {
    expect(addonComponent.length).equal(1);
  });

  it('Should render a tr', () => {
    expect(addonComponent.find("tr")).to.have.length(1);
  });

  it('Should render 5 td tags', () => {
    expect(addonComponent.find("td")).to.have.length(5);
  });

  it('Should render 3 div tags', () => {
    expect(addonComponent.find("div")).to.have.length(3);
  });

  it('Should render an image tag', () => {
    expect(addonComponent.find("img")).to.have.length(1);
  });

  it('Should render an image tag', () => {
    expect(addonComponent.find("img")).to.have.length(1);
  });

  it('Should render app icon', () => {
    expect(addonComponent.find("img").html()).to.contain(owa.appDetails.icons[48]);
  });

  it('Should render correct status icon', () => {
    expect(addonComponent.find("div").at(1).html()).to.contain('<div class="status-icon" id="started-status"></div>');
  });

  it('Should render app name', () => {
    expect(addonComponent.find("td").at(1).html()).to.contain(owa.appDetails.name);
  });

  it('Should render app developer name', () => {
    expect(addonComponent.find("td").at(2).html()).to.contain(owa.appDetails.developer.name);
  });

  it('Should render app version', () => {
    expect(addonComponent.find("td").at(3).html()).to.contain(owa.appDetails.version);
  });

  it('Should render app of type owa', () => {
    expect(addonComponent.instance().props.app.appType).to.equal("owa");
  });

  it('Should render app of type module', () => {
    addonComponent =
    shallow(<SingleAddon
            app={module}
            addonParam={() => {}}
            updatesVersion={{}} />);
    expect(addonComponent.instance().props.app.appType).to.equal("module");
  });
})


