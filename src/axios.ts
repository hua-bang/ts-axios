import { AxiosStatic, AxiosRequestConfig, PartialAxiosRequestConfig, AxiosInstance } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/utils';
import defaultsRequestConfig from './defaults';
import mergeConfig from './core/mergeConfig';

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);

  extend(instance, context);

  return instance as AxiosStatic;
}

const axios = createInstance(defaultsRequestConfig as AxiosRequestConfig);
axios.create = function(config: PartialAxiosRequestConfig): AxiosInstance {
  return createInstance(mergeConfig(defaultsRequestConfig as AxiosRequestConfig, config));
};

export default axios;
