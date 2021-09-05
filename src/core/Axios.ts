import { AxiosConfig, AxiosPromise, AxiosRequestConfig, AxiosResponse, AxiosResponseConfig, Method, RejectedFn, ResolvedFn } from "../types";
import dispatchRequest from "./dipatchRequest";
import InterceptorManager from "./interceptorManager";
import mergeConfig from "./mergeConfig";

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosResponse) => Promise<AxiosPromise>),
  rejected?: RejectedFn
}

function assign(target: any, ...source: any) {
  return Object.assign(target, ...source);
}
export default class Axios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === "string") {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }

    config = mergeConfig(this.defaults, config);

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ];

    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor);
    });

    let promise = Promise.resolve(config);
    while (chain.length) {
      const { rejected, resolved } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }

    return promise;
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMehodWithOutData("get", url, config);
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMehodWithOutData("delete", url, config);
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMehodWithOutData("head", url, config);
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMehodWithOutData("options", url, config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData("post", url, data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData("put", url, data, config);
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData("patch", url, data, config);
  }

  _requestMethodWithData(method: Method, url: string, data?:any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(assign(config || {}, {
      url,
      data,
      method
    }));
  }
 
  _requestMehodWithOutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(assign(config || {}, {
      url,
      method
    }))
  }
}