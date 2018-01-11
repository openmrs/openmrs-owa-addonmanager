import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Addon from '../../app/js/components/manageApps/Addon.jsx';
import StartErrorModal from '../../app/js/components/manageApps/StartErrorModal.jsx';

const app = {
  "uuid": "referencedemodata",
  "display": "Reference Demo Data Module",
  "name": "Reference Demo Data Module",
  "description": "Contains metadata and data required to run an instance of the reference application",
  "packageName": "org.openmrs.module.referencedemodata",
  "author": "OpenMRS",
  "version": "1.4.3",
  "started": false,
  "startupErrorMessage": "Error while trying to start module\nModule Reference Demo Data Module cannot be started because it requires the following module(s): referencemetadata 2.5.0} Please install and start these modules first.\n",
  "requireOpenmrsVersion": "2.0.0",
  "awareOfModules": [],
  "requiredModules": ["org.openmrs.module.providermanagement",
    "org.openmrs.module.referencemetadata",
    "org.openmrs.module.metadatasharing",
    "org.openmrs.module.emrapi",
    "org.openmrs.module.metadatadeploy",
    "org.openmrs.module.idgen"],
  "links": [
    { "rel": "ref", "uri": "http://localhost:8081/openmrs-standalone/ws/rest/v1/module/referencedemodata?v=ref" },
    { "rel": "action", "uri": "http://localhost:8081/openmrs-standalone/ws/rest/v1/moduleaction" },
    { "rel": "self", "uri": "http://localhost:8081/openmrs-standalone/ws/rest/v1/module/referencedemodata" }
  ],
  "resourceVersion": "1.8"
}

describe('<Addon />', () => {
  let component;
  beforeEach(() => {
    component = shallow(<Addon checkLoginStatus={() => {}} />);
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

  it('should display', () => {
    component.setState({ message: 'Error Failed to start', showMessageDetail: true, app });
    expect(component.find(StartErrorModal)).to.have.length(1);
  });

  it('should show error message', () => {
    component.setState({ app: app });
    expect(component.render().find('.error-detail')).to.have.length(1);
  });

  it('should not display', () => {
    app.startupErrorMessage = null;
    component.setState({ showMessageDetail: true, app });
    expect(component.find(StartErrorModal)).to.have.length(0);
  });

});

describe('<StartErrorModal />', () => {
  const errorModal = shallow(
    <StartErrorModal
      isOpen={true}
      app={app}
      message="Error Failed to start"
      hideMsgModal={() => { }}
    />);

  it('should contain the correct error detail message', () => {
    app.startupErrorMessage = "Error while trying to start module\nModule Reference Demo Data Module cannot be started because it requires the following module(s): referencemetadata 2.5.0} Please install and start these modules first.\n";
    expect(errorModal.html()).to.contain(app.startupErrorMessage);
  });

});
