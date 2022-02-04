# 拦截器的设计和实现

在`axios`的使用中，我们都应该用过[`interceptors`](https://axios-http.com/zh/docs/interceptors)为我们的`响应`或`请求`进行处理。

We can intercept requests or responses before they are handled by `then` or `catch`.

```ts
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
```

If you need to remove an interceptor later you can.

```typescript
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});

axios.interceptors.request.eject(myInterceptor);
```

You can add interceptors to a custom instance of axios.

```ts
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```

## 整体设计

拦截器的工作流程如下图所示。

![image-20220204162806328](image-20220204162806328.png)

整个过程是一个链式调用的方式，每个拦截器支持`同步`，`异步`操作。（这里我们使用`Promise`）。

在这个`Promise`链的过程中，请求拦截器`resolve`函数处理的是`config`对象，而响应拦截器`resolve`函数处理的是`response`对象。

根据`axios`的用法我们可以知道，`axios`上具有`interceptors`属性，里面有`request`和`response`分别对应管理`请求拦截器`和`响应拦截器`。

这里的话，我们需要去创建拦截器管理类，允许我们去添加和删除以及遍历拦截器。

## 拦截器管理类的实现

根据需求,`axios`上的`interceptors`属性，里面有`request`和`response`分别对应管理`请求拦截器`和`响应拦截器`，都提供了一个`use`方法来添加拦截器。`use`方法支持两个参数，一个是`resolve`函数，一个是`reject`函数。

对于`resolve`的函数参数：
- 请求拦截器是`AxiosRequestConfig`类型
- 响应拦截器是`AxiosResponse`类型

对于`reject`函数参数类型都是`any`类型。

###  接口定义

```ts
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolveFn<T>, rejected: RejectedFn): void;
}

export interface ResolveFn<T> {
  (val: T): T| Promise<T>;
}

export interface RejectedFn {
  (val: any): any;
}
```

这里我们定义了`AxiosInterceptorManager`泛型接口，因为`请求拦截器`和`响应拦截器`的`resolved`是不同的。

