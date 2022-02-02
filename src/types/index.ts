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
  | 'PATCH';

export interface AxiosRequestConfig {
  url: string;
  method?: RequestMethod;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}

export type PartialAxiosRequestConfig = Partial<AxiosRequestConfig>;

export interface AxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig;
  request: any;
}

export interface AxiosPromise extends Promise<AxiosResponse> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse;
  isAxiosError: boolean;
}

export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise;

  get(url: string, config?: PartialAxiosRequestConfig): AxiosPromise;

  delete(url: string, config?: PartialAxiosRequestConfig): AxiosPromise;

  head(url: string, config?: PartialAxiosRequestConfig): AxiosPromise;

  options(url: string, config?: PartialAxiosRequestConfig): AxiosPromise;

  post(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise;

  put(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise;

  patch(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise;
}

export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise;

  (url: string, config: PartialAxiosRequestConfig): AxiosPromise;
}
