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

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig;
  request: any;
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse;
  isAxiosError: boolean;
}

export interface Axios {
  request<T>(config: AxiosRequestConfig): AxiosPromise<T>;

  get<T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  delete<T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  head<T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  options<T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  post<T>(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  put<T>(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise<T>;

  patch<T>(url: string, data: any, config?: PartialAxiosRequestConfig): AxiosPromise<T>;
}

export interface AxiosInstance extends Axios {
  <T>(config: AxiosRequestConfig): AxiosPromise<T>;

  <T>(url: string, config?: PartialAxiosRequestConfig): AxiosPromise<T>;
}
