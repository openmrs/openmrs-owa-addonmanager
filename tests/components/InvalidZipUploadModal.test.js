import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import InvalidZipUploadModal from '../../app/js/components/manageApps/InvalidZipUploadModal';

describe('<InvalidZipUploadModal />', () => {
  const renderedComponent = shallow(
    <InvalidZipUploadModal
      isOpen={true}
      hideModal={() => {}}
    />
  );

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
})