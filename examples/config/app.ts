import axios from '../../src/index'
import { AxiosTransformer } from '../../src/types'
import qs from 'qs'

// axios.defaults.headers.common['test2'] = 123

// axios({
//   transformRequest: [
//     (function (data) {
//       return qs.stringify(data)
//     }),
//     ...(axios.defaults.transformRequest as AxiosTransformer[])
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
//     if (typeof data === 'object') {
//       data.b = 2
//     }
//     return data
//   }],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then((res) => {
//   console.log(res.data)
// })


let instance = axios.create({
  transformRequest: [
    (function (data) {
      return qs.stringify(data)
    }),
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }],
});

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(res => {
  console.log(res.data);
})

