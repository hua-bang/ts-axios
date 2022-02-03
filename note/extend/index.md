# 扩展接口

## 需求分析

为了方便用户更好的发送`axios`请求，我们可以扩展一些接口。

- `axios.request(config)`
- `axios.get(url[, config])`
- `axios.delete(url[, config])`
- `axios.head(url[, config])`
- `axios.options(url[, config])`
- `axios.post(url[, data, config])`
- `axios.put(url[, data, config])`
- `axios.patch(url[, data, config])`

如果使用这些方法，我们就不必在`config`中配置`url`, `method`, `data`属性。

同时，`axios`不仅是一个方法，同时是一个混合对象。

## 接口类型定义

我们这里会实现本身`axios`的函数，并让他是一个类。

先定义接口.

`types/index.ts`:

```ts
export interface Axios {
  request<T>(config: AxiosRequestConfig): AxiosPromise<T>;

  get<T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  delete<T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  head<T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  options<T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  post<T>(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  put<T>(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  patch<T>(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise<T>;
}

export interface AxiosInstance extends Axios {
  <T>(config: AxiosRequestConfig): AxiosPromise<T>;

  <T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;
}
```

首先定义一个`Axios`类型接口，他描述了Axios中的公共方法，接着定义了`AxiosInstance`接口继承`Axios`,是一个混合类型接口。

## 创建Axios类

我们创建一个`Axios`类, 来实现接口定义的公共方法，创建一个`core`目录
，来存放核心代码。
`core/Axios.ts`
```ts
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
```

## 混合对象的实现

我们需要将`Axios`的函数，其次这个对象包括`Axios`类的所有原型属性和实例属性，我们首先来实现一个辅助函数`extends`

`helpers/utils.ts`

```ts
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
}
```

`axios.ts`

```ts
import { AxiosInstance } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/utils';

function createInstance(): AxiosInstance {
  const context = new Axios();
  const instance = Axios.prototype.request.bind(context);

  extend(instance, context);

  return instance as AxiosInstance;
}

const axios = createInstance();

export default axios;
```