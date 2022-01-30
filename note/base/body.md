# 处理请求BODY参数

## 需求分析

我们通过执行`XMLHttpRequest`对象的`send`来发送请求，我们可以去[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)查阅该方法的请求类型。

我们发现 send 方法的参数支持 Document 和 BodyInit 类型，BodyInit 包括了 Blob, BufferSource, FormData, URLSearchParams, ReadableStream、USVString，当没有数据的时候，我们还可以传入 null。

但是我们最常用的场景还是传一个普通对象给服务端，例如：

```typescript
axios({
  method: 'post',
  url: '/base/post',
  data: { 
    a: 1,
    b: 2 
  }
});
```

上方的数据我们不能直接传，我们需要把他转成`JSON`字符串。

## transformRequest函数的实现

根据需求分析，我们要实现一个工具函数，对 request 中的 data 做一层转换。我们在 helpers 目录新建 `data.ts`文件。

`helpers/data.ts：`
```typescript
import { isPlainObject } from './util'

export function transformRequest (data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
```

`helpers/utils.ts：`
```typescript
export function isPlainObject (val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
```

这里为什么要使用 `isPlainObject` 函数判断，而不用之前的 `isObject` 函数呢，因为 `isObject` 的判断方式，对于 `FormData、ArrayBuffer` 这些类型，`isObject` 判断也为 `true`，但是这些类型的数据我们是不需要做处理的，而 `isPlainObject` 的判断方式，只有我们定义的普通 `JSON` 对象才能满足。

实现请求 body 处理逻辑
index.ts：

import { transformRequest } from './helpers/data'

```typescript
function processConfig (config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transformRequestData(config)
}

function transformRequestData (config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}
```
我们定义了 `transformRequestData` 函数，去转换请求 `body` 的数据，内部调用了我们刚刚实现的的 `transformRequest` 方法。

然后我们在 `processConfig` 内部添加了这段逻辑，在处理完 `url` 后接着对 `config` 中的 `data` 做处理。
