import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import HomePage from '../../app/js/components/homePage/homePage';

describe('<Homepage />', () => {
    const homePage = shallow(< HomePage />);

    it('Should render 2 div', () => {
        expect(homePage.find("div")).to.have.length(2);
    });

    it('Should render 2 buttons', () => {
        expect(homePage.find("button")).to.have.length(2);
    });

    it('Should render h2 with title', () => {
        expect(homePage.find("h2")).to.have.length(1);
        expect(homePage.find("h2").props().children).equals("Add On Manager");
    });

    it('Should render 2 h5 tags with titles', () => {
        expect(homePage.find("h5")).to.have.length(2);
        expect(homePage.find("h5").getNodes()[0].props.children).equals(" Manage Apps ");
        expect(homePage.find("h5").getNodes()[1].props.children).equals(" Manage Settings");
    });

    it('Should render 2 Link tags', () => {
        expect(homePage.find("Link").getNodes()).to.have.length(2);
    });
});