const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
import { encode } from 'js-base64';

export default class ApiClient {
  constructor() {
    this.base_url =  BASE_API_URL + '/api';
  }

  async request(options) {
    let response = await this.requestInternal(options);
    if (response.status === 401 && options.url !== '/tokens') {
      // console.log(localStorage.getItem('accessToken'))
      // console.log(localStorage.getItem('refreshToken'))
      const refreshResponse = await this.put('/tokens', {
        access_token: localStorage.getItem('accessToken'),
        refresh_token: localStorage.getItem('refreshToken')
      });
      if (refreshResponse.ok) {
        localStorage.setItem('accessToken', refreshResponse.body.access_token);
        localStorage.setItem('refreshToken', refreshResponse.body.refresh_token);
        response = this.requestInternal(options);
      }
    }
    // if (response.status >= 500 && this.onError) {
    //   this.onError(response);
    // }
    return response;
  }

  async requestInternal(options) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== '') {
      query = '?' + query;
    }

    let response;
    try {
      //console.log(options.url === '/tokens')
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
      });
    }
    catch (error) {
      response = {
        ok: false,
        status: 500,
        json: async () => { return {
          code: 500,
          message: 'The server is unresponsive',
          description: error.toString(),
        }; }
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null
    };
  }

  async get(url, query, options) {
    return this.request({method: 'GET', url, query, ...options});
  }

  async post(url, body, options) {
    return this.request({method: 'POST', url, body, ...options});
  }

  async put(url, body, options) {
    return this.request({method: 'PUT', url, body, ...options});
  }

  async delete(url, options) {
    return this.request({method: 'DELETE', url, ...options});
  }

  async login(username, password) {
    const response = await this.post('/tokens', null, {
      headers: {
        Authorization:  'Basic ' + encode(username + ":" + password) 
      }
    });
    if (!response.ok) {
      return response.status === 401 ? 'fail' : response.status;
    }
    localStorage.setItem('accessToken', response.body.access_token);
    localStorage.setItem('refreshToken', response.body.refresh_token);
    // console.log(localStorage.getItem('accessToken'))
    // console.log(localStorage.getItem('refreshToken'))
    return 'ok';
  }

  async logout() {
    await this.delete('/tokens');
    localStorage.removeItem('accessToken');
  }

  isAuthenticated() {
    return localStorage.getItem('accessToken') !== null;
  }
}