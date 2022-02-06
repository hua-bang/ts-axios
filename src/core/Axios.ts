import {
  ResolveFn,
  RejectedFn,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  PartialAxiosRequestConfig,
  RequestMethod
} from '../types';
import dispatchRequest from './dispatchRequest';
import InterceptorManager from './interceptorManager';
import mergeConfig from './mergeConfig';

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>;
  response: InterceptorManager<AxiosResponse>;
}

interface PromiseChain<T> {
  resolved: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise);
  rejected?: RejectedFn;
}
export default class Axios {
  defaults: AxiosRequestConfig;
  interceptors: Interceptors;

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    };
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }

    config = mergeConfig(this.defaults, config);

    const defaultInterceptor = {
      resolved: dispatchRequest,
      rejected: undefined
    };

    const chain: PromiseChain<any>[] = [defaultInterceptor];

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor);
    });

    let promise = Promise.resolve(config);

    while (chain.length !== 0) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }

    return promise;
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
