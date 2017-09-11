import fetchPolyfill from 'whatwg-fetch';

const applicationDistribution = location.href.split('/')[3];
const apiBaseUrl = `/${applicationDistribution}/ws/rest/v1`; 

export class ApiHelper {
  constructor(requestLibrary) {
    this.ALLOWED_TYPES = ['GET', 'DELETE', 'POST'];
    this.requestLibrary = requestLibrary || (window.fetch ? window.fetch : fetchPolyfill);
    this.mocked = !(requestLibrary == undefined);
    this.requestOptions = {
      credentials: 'include'
    };
  }

  build(requestUrl, requestType, requestData = {}) {
    if (requestType && (this.ALLOWED_TYPES.indexOf(requestType) == -1)){
      throw new Error('Invalid Request Type');
    }

    this.requestUrl = requestUrl;
    let options = {};
    const contentTypeHeader = 'application/json';

    if (requestType != 'GET'){
      options = {
        method: requestType,
        headers: {
          "Content-Type": contentTypeHeader
        },
        body: JSON.stringify(requestData)
      };
    }
    this.requestOptions = Object.assign({}, this.requestOptions, options);
    return this;
  }

  send() {
    const request = this.requestLibrary;
    const response = request(`${apiBaseUrl}${this.requestUrl}`, this.requestOptions)
      .then((data)=>{
        return this.mocked ? data : data.json();
      })
      .catch((error)=> {
        return error;
      });
    return response;
  }

  get(requestUrl) {
    return this.build(requestUrl, 'GET').send();
  }

  post(requestUrl, requestData) {
    return this.build(requestUrl, 'POST', requestData).send();
  }

  delete(requestUrl) {
    return this.build(requestUrl, 'DELETE').send();
  }
}
