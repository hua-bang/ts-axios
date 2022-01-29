# 编写基础请求代码

我们这节课开始编写 `ts-axios` 库，我们的目标是实现简单的发送请求功能，即客户端通过 `XMLHttpRequest` 对象把请求发送到 server 端，server 端能收到请求并响应即可。

我们实现 `axios` 最基本的操作，通过传入一个对象发送请求，如下：

```typescript
axios({
  method: 'get',
  url: '/simple/get',
  params: {
    a: 1,
    b: 2
  }
})
```

## [#](http://suremotoo.site/ts-axios-doc/chapter3/base.html#创建入口文件)创建入口文件

我们删除 `src` 目录下的文件，先创建一个 `index.ts` 文件，作为整个库的入口文件，然后我们先定义一个 `axios` 方法，并把它导出，如下：

首先，我们先定义类型`AxiosRequestConfig`, 同时我们定义请求的方式类型`RequestMethod`。

```ts
export type RequestMethod =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'options'
  | 'OPTIONS'
  | 'head'
  | 'HEAD'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url: string
  method?: RequestMethod
  data?: any
  params?: any
}
```

编写`index.ts`入口文件代码

```typescript
import { AxiosRequestConfig } from './types'

function axios(config: AxiosRequestConfig) {

}

export default axios
```

## 利用`XMLHttpRequest`来进行请求

更多时候，我们希望`index.ts`作为入口，而并非是逻辑的实现文件。所以，我们将逻辑拆解到一个单独的模块去。于是我们在 `src` 目录下创建一个 `xhr.ts` 文件，我们导出一个 `xhr`方法，它接受一个 `config` 参数，类型也是 `AxiosRequestConfig` 类型。

我们先来实现`xhr`的逻辑
```typescript
import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig) {
}
```
我们在`index.ts`中引入`xhr`.

```typescript
import { AxiosRequestConfig } from './types'
import xhr from './xhr'

function axios(config: AxiosRequestConfig) {
  // TODO:
  xhr(config)
}

export default axios
```

这样，我们一个简易的`axios`入口就实现了。