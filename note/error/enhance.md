# 错误信息增强

## 需求分析

上一节课我们捕获了一些`AJAX`的错误，但错误信息提供的非常有限，我们希望对外提供的信息不仅仅是文本信息，还有`config`,`code`,`XMLHttpRequest`,以及`response`.
```ts
axios({
  method: 'get',
  url: 'error/timeout'
}).then(res => {
  // res
}).catch((err: AxiosError) => {
  // handle
})
```

## 创建AxiosError类
先来定义`AxiosError`类型接口，用于外部使用。

`types/index.ts`

```ts
export interface AxiosError extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse;
  isAxiosError: boolean;
}
```

逻辑代码
```ts
import { AxiosRequestConfig, AxiosResponse } from '../types';

export class AxiosError extends Error {
  isAxiosError: boolean;
  config: AxiosRequestConfig;
  code?: string | null;
  request?: any;
  response?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message);
    this.config = config;
    this.request = request;
    this.code = code;
    this.response = response;

    this.isAxiosError = true;

    Object.setPrototypeOf(this, AxiosError.prototype);
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
): AxiosError {
  return new AxiosError(message, config, code, request, response);
}
```

## 导出类型定义

将之前的`index.ts`代码拷贝到`axios.ts`

`index.ts`文件仅仅做导入/导出。

```ts
import axios from './axios';
export * from './types';
export default axios;
```