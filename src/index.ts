import { AxiosRequestConfig } from './types';
import xhr from './xhr';

function axios(config: AxiosRequestConfig) {
  // TODO:
  xhr(config);
}

export default axios;
