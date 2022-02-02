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
  request(config: )
}
```