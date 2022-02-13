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
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  cancelToken?: CancelToken;
  [propName: string]: any;
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
  defaults: AxiosRequestConfig;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };

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

export interface AxiosStatic extends AxiosInstance {
  create(config: PartialAxiosRequestConfig): AxiosInstance;

  CancelToken: CancelTokenStatic;
  Cancel: CancelStatic;
  isCancel: (val: any) => boolean;
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolveFn<T>, rejected?: RejectedFn): number;

  eject(id: number): void;
}

export interface ResolveFn<T> {
  (val: T): T | Promise<T>;
}

export interface RejectedFn {
  (val: any): any;
}

export interface AxiosTransformer {
  (data: any, headers: any): any;
}

export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  throwIfRequested(): void;
}

export interface Canceler {
  (message?: string): void;
}

export interface CancelExecutor {
  (cancel: Canceler): void;
}

export interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken;

  source(): CancelTokenSource;
}

export interface Cancel {
  message?: string;
}

export interface CancelStatic {
  new (message?: string): Cancel;
}
