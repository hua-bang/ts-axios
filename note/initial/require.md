# 需求分析

接下来的章节，我们会使用 TypeScript 来重构 axios，重构之前，我们需要简单地做一些需求分析，看一下我们这次重构需要支持哪些 feature。

## [#](http://suremotoo.site/ts-axios-doc/chapter3/require.html#features)Features

- 在浏览器端使用 XMLHttpRequest 对象通讯
- 支持 Promise API
- 支持请求和响应的拦截器
- 支持请求数据和响应数据的转换
- 支持请求的取消
- JSON 数据的自动转换
- 客户端防止 XSRF

那么接下来我们就开始初始化项目吧！