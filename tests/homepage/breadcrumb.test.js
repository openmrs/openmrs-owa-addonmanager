import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import BreadCrumbComponent from '../../app/js/components/breadCrumb/breadCrumbComponent';

describe('<BreadCrumbComponent />', () => {
    const breadCrumb = shallow( < BreadCrumbComponent />);

    it('Should render 1 div', () => {
        expect(breadCrumb.find("div")).to.have.length(1);
    });
    
    it('Should render 1 anchor tag', () => {
        expect(breadCrumb.find("a")).to.have.length(1);
    });

    it('Should render a title in a span', () => {
        expect(breadCrumb.find("span")).to.have.length(3);
        expect(breadCrumb.find("span").getNodes()[2].props.children).equals("Add-On Manager");
    });

    it('Should have a link that contains 2 children props', () => {
        expect(breadCrumb.find("Link")).to.have.length(1);
        expect(breadCrumb.find("Link").props().children).to.have.length(2);
    });
});
