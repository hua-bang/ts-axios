import { AxiosPromise, AxiosRequestConfig, AxiosResponseConfig, Method } from "../types";
import dispatchRequest from "./dipatchRequest";

function assign(target: any, ...source: any) {
  return Object.assign(target, ...source);
}

export default class Axios {
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === "string") {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }
    return dispatchRequest(config);
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