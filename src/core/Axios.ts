import {
  AxiosPromise,
  AxiosRequestConfig,
  PartialAxiosRequestConfig,
  RequestMethod
} from '../types';
import dispatchRequest from './dispatchRequest';

export default class Axios {
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }
    return dispatchRequest(config);
  }

  get(url: string, config?: PartialAxiosRequestConfig) {
    return this._requestMethodWithOutData('get', url, config);
  }

  delete(url: string, config?: PartialAxiosRequestConfig) {
    return this._requestMethodWithOutData('delete', url, config);
  }

  head(url: string, config?: PartialAxiosRequestConfig) {
    return this._requestMethodWithOutData('head', url, config);
  }

  options(url: string, config?: PartialAxiosRequestConfig) {
    return this._requestMethodWithOutData('options', url, config);
  }

  post(url: string, data?: any, config?: PartialAxiosRequestConfig) {
    return this._requestMethodWithData('post', url, data, config);
  }

  put(url: string, data?: any, config?: PartialAxiosRequestConfig) {
    return this._requestMethodWithData('put', url, data, config);
  }

  patch(url: string, data?: any, config?: PartialAxiosRequestConfig) {
    return this._requestMethodWithData('patch', url, data, config);
  }

  _requestMethodWithOutData(
    method: RequestMethod,
    url: string,
    config?: PartialAxiosRequestConfig
  ) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    );
  }

  _requestMethodWithData(
    method: RequestMethod,
    url: string,
    data: any,
    config?: PartialAxiosRequestConfig
  ) {
    return this.request(
      Object.assign(config || {}, {
        method,
        data,
        url
      })
    );
  }
}
