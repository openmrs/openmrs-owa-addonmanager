import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import HomePage from '../../app/js/components/homePage/HomePage';

describe('<Homepage />', () => {
    const homePage = shallow(< HomePage />);

    it('Should render 3 div', () => {
        expect(homePage.find("div")).to.have.length(3);
    });

    it('Should render 2 buttons', () => {
        expect(homePage.find("button")).to.have.length(2);
    });

    it('Should render h2 with title', () => {
        expect(homePage.find("h2")).to.have.length(1);
        expect(homePage.find("h2").props().children).equals("Add On Manager");
    });

    it('Should render 2 p tags with titles', () => {
        expect(homePage.find("p")).to.have.length(2);
        expect(homePage.find("p").getNodes()[0].props.children).equals("Manage Addons");
        expect(homePage.find("p").getNodes()[1].props.children).equals("Manage Settings");
    });

    it('Should render 2 Link tags', () => {
        expect(homePage.find("Link").getNodes()).to.have.length(2);
    });

});
