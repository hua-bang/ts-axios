# 获取响应数据

## 需求分析

在前面的章节中，我们发送的请求都可以从网络层面接收到服务器返回的数据，但是我们并没有在代码层面做任何关于响应数据的处理。我们希望我们能处理服务端响应的数据的数据，并支持`Promise`链式调用。

```typescript
axios({
  url: '/base/post',
  method: 'post'
}).then(res => {
  // code
});
```
我们希望我们可以拿到`res`对象，包括：

- 服务端返回的数据 `data`
- HTTP状态码 `status`
- 状态信息 `statusText`
- 响应头 `headers`
- 请求配置文件 `config`
- 请求的`XMLHttpRequest`的对象实例`request`

我们可以参考`axios`中[response](https://github.com/axios/axios/blob/master/index.d.ts#L130)类型定义。


## 类型定义

```typescript
export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}
```

另外，axios 函数返回的是一个 Promise 对象，我们可以定义一个 AxiosPromise 接口，它继承于 Promise<AxiosResponse> 这个泛型接口：

```typescript
export interface AxiosPromise extends Promise<AxiosResponse> {
}
```

这样的话，当 axios 返回的是 AxiosPromise 类型，那么 resolve 函数中的参数就是一个 AxiosResponse 类型。

对于一个 AJAX 请求的 response，我们是可以指定它的响应的数据类型的，通过设置 XMLHttpRequest 对象的 responseType 属性，于是我们可以给 AxiosRequestConfig 类型添加一个可选属性：

```typescript
export interface AxiosRequestConfig {
  // ...
  responseType?: XMLHttpRequestResponseType
}
```
responseType 的类型是一个 `XMLHttpRequestResponseType` 类型，它的定义是 `"" | "arraybuffer" | "blob" | "document" | "json" | "text"` 字符串字面量类型。

## 实现获取响应数据逻辑

这里我们直接在`xhr`函数返回`promise`, 添加`onreadystatechange` 事件处理函数，并且让 `xhr` 函数返回的是 `AxiosPromise` 类型。

`xhr.ts`

```typescript
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType } = config;

    const request = new XMLHttpRequest();

    if (responseType) {
      request.responseType = responseType;
    }

    request.open(method.toUpperCase(), url, true);

    // you can visit `https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/onreadystatechange` to learn this api 
    request.onreadystatechange = () => {
      if (request.readyState !== XMLHttpRequest.DONE) {
        return;
      }
      
      const responseHeaders = request.getAllResponseHeaders();
      const responseData = responseType !== 'text' ? request.response : request.responseText;
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders as unknown as Record<string, string>,
        config,
        request
      }
      resolve(response);
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name];
      }
      request.setRequestHeader(name, headers[name]);
    });

    request.send(data);
  });
}
```

修改了 `xhr` 函数，我们同样也要对应修改 `axios` 函数：

`index.ts：`

```typescript
function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config)
}
```
这样我们就实现了 `axios` 函数的 `Promise` 化。

上方，我们确实能拿到数据，但是存在着两个问题
- `headers`值我们需要进行反序列化成`对象`.
- 对`data`数据的处理。