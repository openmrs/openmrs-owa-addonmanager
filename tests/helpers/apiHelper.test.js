import { expect } from 'chai';
import { ApiHelper } from '../../app/js/helpers/apiHelper';

describe('ApiHelper tests', () => {
    const apiHelper = new ApiHelper();
    apiHelper.build('http://openmrs.org');

    it('should build a request', () => {
        expect(apiHelper.requestUrl).to.equal('http://openmrs.org');
    });

    it('should return a response object', () => {
        expect(apiHelper.requestOptions).to.be.an.instanceOf(Object);
    });

    it('should include all requestOptions', () => {
        expect(apiHelper.requestOptions).to.have.property('method');
        expect(apiHelper.requestOptions).to.have.property('headers');
        expect(apiHelper.requestOptions).to.have.property('body');
    });

    it('should add passed formData to the request object if request method is POST', () => {
        const formData = {
          userName: 'johnDoe',
          email: 'john@doe.com'
        };
        expect(apiHelper.build('http://openmrs.org', 'POST', formData).requestOptions.body).to.equal(JSON.stringify(formData));
      });


    it('should throw an error for invalid request types', () => {
        expect(apiHelper.build.bind(apiHelper, 'http://openmrs.org', 'STOP HAMMERTIME')).to.throw('Invalid Request Type');
    });

})
