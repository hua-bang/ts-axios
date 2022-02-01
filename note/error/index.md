# 错误处理

## 需求分析

我们实现了`axios`最基本的功能，但我能还没有考虑错误情况的处理，这里我们需要对错误情况及进行处理。

并且，我们希望程序能捕获这种错误，进一步`handle`。

```typescript
axios({
  method: 'get',
  url: '/error/get',
}).then(res => {
  // handle res
}).catch(err => {
  // handle err
});
```

此后，我们都可以在`reject`回调中捕获。

下面，我们分别处理错误情况。

## 处理网络异常请求

当网络出现异常的时候会触发`XMLHttpRequest`的`error`事件，于是我们可以在`onerror`事件中捕获这个错误。

```typescript
request.onerror = () => {
  reject(new Error('Network Error'));
}
```

## 处理超时错误

我们可以设置某个请求超时时间`timeout`, 也就是请求发送后超过某个时间后如果没有收到响应，则请求自动终止，并触发`timeout`时间。

`types/index.ts`
请求默认的超时时间是0，永不超时。

```ts
export interface AxiosRequestConfig {
  url: string;
  method?: RequestMethod;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}
```
文件逻辑代码
```ts
if (timeout) {
  request.timeout = timeout;
}

// handle request timeout
request.ontimeout = () => {
  reject(new Error(`timeout of ${timeout} ms exceeded`));
}
```

## 处理非200状态码

对于一个正常的请求， 往往返回`200-300`的[`HTTP状态码`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status), 对于不在这个区间的`StatusCode`，我们也认为是一种错误的情况做处理。

```ts
request.onreadystatechange = () => {
  if (request.readyState !== XMLHttpRequest.DONE) {
  return;
}

const responseHeaders = parseHeaders(request.getAllResponseHeaders());
const responseData = responseType !== 'text' ? request.response : request.responseText;
const response: AxiosResponse = {
  data: responseData,
  status: request.status,
  statusText: request.statusText,
  headers: responseHeaders,
  config,
  request
};
  handleResponse(response);
};

function handleResponse(response: AxiosResponse) {
  const { status } = response;
  if (status >= HTTP_STATUS_ENUM.SUCCESS && status < HTTP_STATUS_ENUM.REDIRECTION) {
    resolve(response);
  } else {
    reject(new Error(`Request failed with status code ${response.status}`));
  }
}
```

我们在 `onreadystatechange` 的回调函数中，添加了对 `request.status` 的判断，因为当出现网络错误或者超时错误的时候，该值都为 `0`。

接着我们在 `handleResponse` 函数中对 `request.status` 的值再次判断，如果是 `2xx` 的状态码，则认为是一个正常的请求，否则抛错。

