import { AxiosInstance, AxiosRequestConfig } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/utils';
import defaultsRequestConfig from './defaults';

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);

  extend(instance, context);

  return instance as AxiosInstance;
}

const axios = createInstance(defaultsRequestConfig as AxiosRequestConfig);

export default axios;
