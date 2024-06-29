import axios from 'axios';


export default class RequestManager {
    constructor() {
        this.makeRequest = this.makeRequest.bind(this);
        this.makePostRequest = this.makePostRequest.bind(this);
        this.makeGetRequest = this.makeGetRequest.bind(this);
        this.getAuthHeader = this.getAuthHeader.bind(this);
    }

    makeRequest(requestMethod, apiUrl, requestHeaders, requestData) {
        return axios(
            {
                method: requestMethod,
                url: apiUrl,
                headers: requestHeaders,
                data: requestData,
            });
    }

    makePostRequest(apiUrl, requestHeaders, requestData) {
        return this.makeRequest(
            'post', apiUrl, requestHeaders, requestData
        );
    }

    makeGetRequest(apiUrl, requestHeaders, requestData) {
        return this.makeRequest(
            'get', apiUrl, requestHeaders, requestData
        );
    }

    makePutRequest(apiUrl, requestHeaders, requestData) {
        return this.makeRequest(
            'put', apiUrl, requestHeaders, requestData
        );
    }

    makePatchRequest(apiUrl, requestHeaders, requestData) {
        return this.makeRequest(
            'patch', apiUrl, requestHeaders, requestData
        );
    }

    makeDeleteRequest(apiUrl, requestHeaders) {
        return this.makeRequest(
            'delete', apiUrl, requestHeaders, {}
        );
    }

    getAuthHeader() {
        return {
            'Authorization': 'JWT ' + localStorage.getItem('fap_access')
        }
    }
}