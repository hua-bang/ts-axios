import Axios from "./core/Axios";
import {  AxiosRequestConfig, AxiosStatic } from "./types";
import { extend } from "./helpers/utils";
import defaultsConfig from "./defaults";
import mergeConfig from "./core/mergeConfig";
import defaults from "./defaults";

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);
  extend(instance, context);
  return instance as AxiosStatic;
}

const axios = createInstance(defaultsConfig);

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config));
}

export default axios;